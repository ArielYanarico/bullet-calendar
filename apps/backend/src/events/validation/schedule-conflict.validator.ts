import { Injectable, BadRequestException } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleCalendarService } from '../../google-calendar/google-calendar.service';
import mapGoogleEventToLocal from '../utils/mapGoogleEventToLocal';

export interface ConflictCheckResult {
  hasConflicts: boolean;
  conflicts: Array<{
    id: string | number;
    title: string;
    start: string;
    end: string;
    source: 'local' | 'google';
  }>;
}

@Injectable()
export class ScheduleConflictValidator {
  constructor(
    private prisma: PrismaService,
    private googleCalendarService: GoogleCalendarService
  ) { }

  /**
   * Validates that a time slot doesn't conflict with existing events
   * @param userId - User ID to check conflicts for
   * @param startTime - Start time of the new event
   * @param endTime - End time of the new event
   * @param excludeEventId - Optional event ID to exclude from conflict check (for updates)
   * @throws BadRequestException if conflicts are found
   */
  async validateNoConflicts(
    userId: number,
    startTime: Date,
    endTime: Date,
    excludeEventId?: number
  ): Promise<void> {
    if (endTime <= startTime) {
      throw new BadRequestException('Event end time must be after start time');
    }

    const conflictResult = await this.checkConflicts(
      userId,
      startTime,
      endTime,
      excludeEventId
    );

    if (conflictResult.hasConflicts) {
      const conflictTitles = conflictResult.conflicts.map(c => c.title).join(', ');
      const sources = [...new Set(conflictResult.conflicts.map(c => c.source))];
      const sourceText = sources.includes('google') && sources.includes('local')
        ? 'existing and Google Calendar events'
        : sources.includes('google')
          ? 'Google Calendar events'
          : 'existing events';

      throw new BadRequestException(
        `Scheduling conflict detected with ${sourceText}: ${conflictTitles}`
      );
    }
  }

  /**
   * Checks for scheduling conflicts without throwing errors
   * @param userId - User ID to check conflicts for
   * @param startTime - Start time to check
   * @param endTime - End time to check
   * @param excludeEventId - Optional event ID to exclude from conflict check
   * @returns ConflictCheckResult with conflict details
   */
  async checkConflicts(
    userId: number,
    startTime: Date,
    endTime: Date,
    excludeEventId?: number
  ): Promise<ConflictCheckResult> {
    const conflicts: ConflictCheckResult['conflicts'] = [];

    const localConflicts = await this.checkLocalEventConflicts(
      userId,
      startTime,
      endTime,
      excludeEventId
    );
    conflicts.push(...localConflicts);

    const googleConflicts = await this.checkGoogleCalendarConflicts(
      userId,
      startTime,
      endTime
    );
    conflicts.push(...googleConflicts);

    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }

  /**
   * Check conflicts with local database events
   * Searches for events that overlap with the specified time range, excluding a specific event if provided.
   * @param userId - The ID of the user whose events are checked for conflicts.
   * @param startTime - The start time of the new event.
   * @param endTime - The end time of the new event.
   * @param excludeEventId - (Optional) The ID of an event to exclude from conflict checking (e.g., when updating an event).
   * @returns A promise that resolves to an array of conflicting local events, each containing the event's ID, title, start and end times, and source.
   */
  private async checkLocalEventConflicts(
    userId: number,
    startTime: Date,
    endTime: Date,
    excludeEventId?: number
  ): Promise<ConflictCheckResult['conflicts']> {
    const conflictingLocalEvents = await this.prisma.event.findMany({
      where: {
        userId: userId,
        id: excludeEventId ? { not: excludeEventId } : undefined,
        OR: [
          // New event starts during existing event
          { AND: [{ start: { lte: startTime } }, { end: { gt: startTime } }] },
          // New event ends during existing event
          { AND: [{ start: { lt: endTime } }, { end: { gte: endTime } }] },
          // New event completely contains existing event
          { AND: [{ start: { gte: startTime } }, { end: { lte: endTime } }] },
          // Existing event completely contains new event
          { AND: [{ start: { lte: startTime } }, { end: { gte: endTime } }] }
        ]
      }
    });

    return conflictingLocalEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      source: 'local' as const
    }));
  }

  /**
   * Check conflicts with Google Calendar events
   * Searches for events that overlap with the specified time range.
   * @param userId - The ID of the user whose events are checked for conflicts.
   * @param startTime - The start time of the new event.
   * @param endTime - The end time of the new event.
   * @returns A promise that resolves to an array of conflicting local events, each containing the event's ID, title, start and end times, and source.
   */
  private async checkGoogleCalendarConflicts(
    userId: number,
    startTime: Date,
    endTime: Date
  ): Promise<ConflictCheckResult['conflicts']> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const accessToken = (user as any)?.googleAccessToken;

      if (!accessToken) {
        // No Google integration, no conflicts
        return [];
      }

      const googleEvents = await this.googleCalendarService.listEvents(
        accessToken,
        'primary',
        {
          timeMin: moment(startTime).subtract(1, 'day').toISOString(),
          timeMax: moment(endTime).add(1, 'day').toISOString(),
          singleEvents: true,
        }
      );

      const conflictingGoogleEvents = googleEvents.filter(googleEvent => {
        return this.isTimeOverlap(
          startTime,
          endTime,
          googleEvent.start?.dateTime || googleEvent.start?.date || undefined,
          googleEvent.end?.dateTime || googleEvent.end?.date || undefined
        );
      });

      return conflictingGoogleEvents.map(event => ({...mapGoogleEventToLocal(event, userId), source: 'google'}));

    } catch (error) {
      console.warn('Could not check Google Calendar conflicts:', error.message);
      return [];
    }
  }

  /**
   * Determines if two time intervals overlap.
   *
   * Overlap is detected if:
   * - The new event starts during the other event.
   * - The new event ends during the other event.
   * - The new event completely contains the other event.
   * - The other event completely contains the new event.
   *
   * @param start1 - The start time of the new event as a Date object.
   * @param end1 - The end time of the new event as a Date object.
   * @param start2 - The start time of the other event as a string (ISO format) or undefined.
   * @param end2 - The end time of the other event as a string (ISO format) or undefined.
   * @returns `true` if the time intervals overlap; otherwise, `false`.
   */
  private isTimeOverlap(
    start1: Date,
    end1: Date,
    start2: string | undefined,
    end2: string | undefined
  ): boolean {
    if (!start2 || !end2) return false;

    const googleStart = moment(start2);
    const googleEnd = moment(end2);
    const newStart = moment(start1);
    const newEnd = moment(end1);

    return (
      // New event starts during Google event
      (newStart.isBefore(googleEnd) && newStart.isSameOrAfter(googleStart)) ||
      // New event ends during Google event
      (newEnd.isSameOrBefore(googleEnd) && newEnd.isAfter(googleStart)) ||
      // New event completely contains Google event
      (newStart.isSameOrBefore(googleStart) && newEnd.isSameOrAfter(googleEnd)) ||
      // Google event completely contains new event
      (googleStart.isSameOrBefore(newStart) && googleEnd.isSameOrAfter(newEnd))
    );
  }
}
