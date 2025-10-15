import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';
import { ScheduleConflictValidator } from './validation/schedule-conflict.validator';

@Module({
  imports: [PrismaModule, GoogleCalendarModule],
  controllers: [EventsController],
  providers: [EventsService, ScheduleConflictValidator],
  exports: [EventsService],
})
export class EventsModule {}
