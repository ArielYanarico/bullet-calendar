'use client';
import { useEffect, useMemo, useRef } from 'react';
import { Box, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useEvents } from '../../contexts/AppProviders';
import AddEventModal, { AddEventModalHandles } from '../../components/AddEventModal';
import CalendarStats from '../../components/CalendarStats';
import { eventStyleGetter, transformEventsForCalendar } from '../../lib/calendarUtils';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const { state: eventsState, actions: eventsActions } = useEvents();
  const addEventModal = useRef<AddEventModalHandles>(null);

  useEffect(() => {
    eventsActions.loadEvents();
  }, []);

  const calendarEvents = useMemo(() => {
    return transformEventsForCalendar(eventsState.events);
  }, [eventsState.events]);

  if (eventsState.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading events...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bullet Calendar
      </Typography>

      {eventsState.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={eventsActions.clearError}>
          Events Error: {eventsState.error}
        </Alert>
      )}

      <CalendarStats events={eventsState.events} />

      <Paper elevation={2} sx={{ p: 2, height: 600 }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="week"
          step={30}
          timeslots={2}
          onSelectEvent={(event) => {
            const originalEvent = event.resource?.originalEvent;
            addEventModal.current?.handleOpen();
            addEventModal.current?.setFormData({
              ...originalEvent,
              start: moment(originalEvent.start).format('yyyy-MM-DDTHH:mm'),
              end: moment(originalEvent.end).format('yyyy-MM-DDTHH:mm'),
            } as any);
          }}
          onSelectSlot={({ start, end }) => {
            addEventModal.current?.handleOpen();
            addEventModal.current?.setFormData({
              userId: '',
              title: '',
              description: '',
              status: 'scheduled',
              start: moment(start).format('yyyy-MM-DDTHH:mm'),
              end: moment(end).format('yyyy-MM-DDTHH:mm'),
            });
          }}
          selectable
        />
      </Paper>
      <AddEventModal ref={addEventModal} />
    </Box>
  );
}
