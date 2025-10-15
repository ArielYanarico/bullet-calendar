'use client';
import { useEffect, useMemo, useRef } from 'react';
import { Box, Typography, CircularProgress, Paper, Alert, AppBar, Toolbar, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useEvents } from '@/contexts/AppProviders';
import AddEventModal, { AddEventModalHandles } from '@/components/AddOrUpdateEventModal';
import CalendarStats from '@/components/CalendarStats';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile';
import { eventStyleGetter, transformEventsForCalendar } from '@/lib/calendarUtils';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

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
    <ProtectedRoute>
      <Box sx={{ minHeight: '90vh', pt: '52px' }}>
        <AppBar position="fixed" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Bullet Calendar
            </Typography>
            <Button 
              onClick={eventsActions.loadEvents}
              variant='outlined'
              color='inherit'
              sx={{ mr: 2 }}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
            <UserProfile />
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
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
              selectable
              popup
              onSelectEvent={(event) => {
                const originalEvent = event.resource?.originalEvent;
                addEventModal.current?.handleOpen();
                addEventModal.current?.setFormData({
                  ...originalEvent,
                  start: moment(originalEvent.start).format('yyyy-MM-DDTHH:mm'),
                  end: moment(originalEvent.end).format('yyyy-MM-DDTHH:mm'),
                  isUpdate: true,
                } as any);
              }}
              onSelectSlot={({ start, end }) => {
                addEventModal.current?.handleOpen();
                addEventModal.current?.setFormData({
                  title: '',
                  description: '',
                  status: 'scheduled',
                  start: moment(start).format('yyyy-MM-DDTHH:mm'),
                  end: moment(end).format('yyyy-MM-DDTHH:mm'),
                });
              }}
            />
          </Paper>
          <AddEventModal ref={addEventModal} />
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
