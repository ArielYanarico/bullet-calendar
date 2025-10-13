'use client';
import { Box, Typography, Button, Container } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <CalendarToday sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Bullet Calendar
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
          A modern bullet journal calendar application
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Link href="/calendar" passHref>
            <Button variant="contained" size="large" sx={{ mr: 2 }}>
              View Calendar
            </Button>
          </Link>
          <Button variant="outlined" size="large">
            Learn More
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
