import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

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

  async findAll() {
    return this.prisma.event.findMany({
      include: {
        user: true,
      },
    });
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
    
    // Convert dates if provided
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