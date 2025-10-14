import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService, private googleCalendarService: GoogleCalendarService) { }

  private mapGoogleEventToLocal(event: any, userId: number) {
    return {
      id: event.id,
      userId: userId,
      title: event.summary,
      description: event.description,
      status: event.status,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      createdAt: event.created,
      isGoogleEvent: true,
    };
  }

  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        start: new Date(createEventDto.start),
        end: new Date(createEventDto.end),
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
      googleEvents = googleRawEvents.map(event => this.mapGoogleEventToLocal(event, userId));
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
    const data = { ...updateEventDto };

    if (updateEventDto.start) {
      data.start = new Date(updateEventDto.start);
    }
    if (updateEventDto.end) {
      data.end = new Date(updateEventDto.end);
    }

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
