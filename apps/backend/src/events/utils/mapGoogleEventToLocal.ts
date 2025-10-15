
/**
 * Maps a Google Calendar event object to the local event format.
 *
 * @param event - The Google Calendar event object to map.
 * @param userId - The ID of the user associated with the event.
 * @returns An object representing the local event, containing relevant fields from the Google event.
 */
export default function mapGoogleEventToLocal(event: any, userId: number) {
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
