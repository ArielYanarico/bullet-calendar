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
        startAt: new Date(createEventDto.startAt),
        finishAt: new Date(createEventDto.finishAt),
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
    if (updateEventDto.startAt) {
      data.startAt = new Date(updateEventDto.startAt);
    }
    if (updateEventDto.finishAt) {
      data.finishAt = new Date(updateEventDto.finishAt);
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