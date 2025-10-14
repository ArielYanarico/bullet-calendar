import { Box, Typography, Paper } from '@mui/material';
import { Event } from '@/lib/api';

interface CalendarStatsProps {
  events: Event[];
}

export default function CalendarStats({ events }: CalendarStatsProps) {
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const inProgressEvents = events.filter(e => e.status === 'in-progress').length;
  const scheduledEvents = events.filter(e => e.status === 'scheduled').length;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      <Paper elevation={1} sx={{ p: 2, minWidth: 120 }}>
        <Typography variant="h6" color="primary">
          {totalEvents}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Events
        </Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, minWidth: 120 }}>
        <Typography variant="h6" color="success.main">
          {completedEvents}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completed
        </Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, minWidth: 120 }}>
        <Typography variant="h6" color="warning.main">
          {inProgressEvents}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          In Progress
        </Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, minWidth: 120 }}>
        <Typography variant="h6" color="info.main">
          {scheduledEvents}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Scheduled
        </Typography>
      </Paper>
    </Box>
  );
}
