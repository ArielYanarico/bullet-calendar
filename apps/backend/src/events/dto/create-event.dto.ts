export class CreateEventDto {
  userId: number;
  title: string;
  description?: string;
  status: string;
  start: Date;
  end: Date;
}