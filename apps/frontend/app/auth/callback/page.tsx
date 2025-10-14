'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../../contexts/AppProviders';
import { AuthUser } from '../../../lib/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { actions } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (!token || !userParam) {
          console.error('Missing token or user data in callback');
          router.push('/login?error=auth_failed');
          return;
        }

        const user: AuthUser = JSON.parse(decodeURIComponent(userParam));
        console.log('We are here with: ', token);
        
        actions.setAuth(user, token);
        router.push('/calendar');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6">
        Completing authentication...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we set up your account
      </Typography>
    </Box>
  );
}
