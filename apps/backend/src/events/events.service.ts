import { Injectable, BadRequestException } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ScheduleConflictValidator } from './validation/schedule-conflict.validator';
import mapGoogleEventToLocal from './utils/mapGoogleEventToLocal';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService, 
    private googleCalendarService: GoogleCalendarService,
    private scheduleValidator: ScheduleConflictValidator
  ) { }

  async create(createEventDto: CreateEventDto) {
    const startDate = new Date(createEventDto.start);
    const endDate = new Date(createEventDto.end);

    await this.scheduleValidator.validateNoConflicts(
      createEventDto.userId,
      startDate,
      endDate
    );

    return this.prisma.event.create({
      data: {
        ...createEventDto,
        start: startDate,
        end: endDate,
      },
      include: {
        user: true,
      },
    });
  }

  async findAllWithGoogleIntegration(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const accessToken = (user as any)?.googleAccessToken;
    let googleEvents: any[] = [];
    try {
      const googleRawEvents = await this.googleCalendarService.listEvents(
        accessToken,
        'primary',
        {
          timeMin: moment().startOf('year').toISOString(),
          timeMax: moment().endOf('year').toISOString(),
          singleEvents: true,
        }
      );
      googleEvents = googleRawEvents.map(event => mapGoogleEventToLocal(event, userId));
    } catch (error) {
      throw new Error(`Failed to fetch Google Calendar events: ${error.message}`);
    }

    const localEvents = await this.prisma.event.findMany({
      include: {
        user: true,
      },
    });

    return [
      ...localEvents,
      ...googleEvents,
    ];
  }

  async findOne(id: number) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.event.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      throw new BadRequestException('Event not found');
    }

    const data = { ...updateEventDto };
    let startDate = existingEvent.start;
    let endDate = existingEvent.end;

    if (updateEventDto.start) {
      startDate = new Date(updateEventDto.start);
      data.start = startDate;
    }
    if (updateEventDto.end) {
      endDate = new Date(updateEventDto.end);
      data.end = endDate;
    }

    await this.scheduleValidator.validateNoConflicts(
      existingEvent.userId,
      startDate,
      endDate,
      id
    );

    return this.prisma.event.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
