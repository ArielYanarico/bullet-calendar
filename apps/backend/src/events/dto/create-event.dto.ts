export class CreateEventDto {
  userId: number;
  title: string;
  description?: string;
  status: string;
  startAt: Date;
  finishAt: Date;
}