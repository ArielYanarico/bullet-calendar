import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World! Prisma is now integrated with NestJS';
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        events: true,
      },
    });
  }

  async createUser(username: string) {
    return this.prisma.user.create({
      data: {
        username,
      },
    });
  }

  async getAllEvents() {
    return this.prisma.event.findMany({
      include: {
        user: true,
      },
    });
  }

  async createEvent(data: {
    userId: number;
    title: string;
    description?: string;
    status: string;
    startAt: Date;
    finishAt: Date;
  }) {
    return this.prisma.event.create({
      data,
      include: {
        user: true,
      },
    });
  }
}
