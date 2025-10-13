import { Event } from './api';

/**
 * Transform API events to React Big Calendar format
 * Converts event dates and adds resource data for styling and interactions
 */
export const transformEventsForCalendar = (events: Event[]) => {
  return events.map((event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    return {
      id: event.id,
      title: event.title,
      start: startDate,
      end: endDate,
      allDay: false,
      resource: {
        description: event.description,
        status: event.status,
        user: event.user,
        originalEvent: event,
      },
    };
  });
};

/**
 * Custom event style getter based on event status
 * Returns style object for calendar events with different colors per status
 */
export const eventStyleGetter = (event: any) => {
  let backgroundColor = '#3174ad'; // default blue
  
  switch (event.resource?.status) {
    case 'completed':
      backgroundColor = '#4caf50'; // green
      break;
    case 'in-progress':
      backgroundColor = '#ff9800'; // orange
      break;
    case 'cancelled':
      backgroundColor = '#f44336'; // red
      break;
    case 'scheduled':
    default:
      backgroundColor = '#2196f3'; // blue
      break;
  }

  return {
    style: {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    },
  };
};
