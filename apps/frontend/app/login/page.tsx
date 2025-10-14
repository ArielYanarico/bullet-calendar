'use client';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import { Google as GoogleIcon, Launch as LaunchIcon } from '@mui/icons-material';
import { CalendarToday } from '@mui/icons-material';
import Link from 'next/link';
import { initiateGoogleLogin } from '@/lib/auth';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <CalendarToday sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Bullet Calendar
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign in with your Google account to access your calendar
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                width: { xs: 220, sm: 180 },
                mr: { xs: 0, sm: 2 },
                mb: { xs: 2, sm: 0 },
              }}
            >
              Sign in
            </Button>
            <Link href="https://github.com/ArielYanarico/bullet-calendar" target='_blank' passHref>
              <Button variant="outlined" size="large" sx={{ width: { xs: 220, sm: 180 }, }}>
                More Info&nbsp;<LaunchIcon sx={{ width: 14 }}/>
              </Button>
            </Link>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            We use Google OAuth for secure authentication.
            <br />
            Your data is safe and secure.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
