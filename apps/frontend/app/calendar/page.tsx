'use client';
import { useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import { useEvents } from '../../contexts/AppProviders';

export default function CalendarPage() {
  const { state: eventsState, actions: eventsActions } = useEvents();

  useEffect(() => {
    eventsActions.loadEvents();
  }, []);

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
        Events Calendar
      </Typography>

      {eventsState.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={eventsActions.clearError}>
          Events Error: {eventsState.error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Events JSON Data:
        </Typography>
        <Box
          component="pre"
          sx={{
            backgroundColor: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: '300px',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {JSON.stringify(eventsState.events, null, 2)}
        </Box>
      </Paper>
    </Box>
  );
}
