'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AppProviders';

export default function HomePage() {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isLoading) {
      if (state.isAuthenticated) {
        router.push('/calendar');
      } else {
        router.push('/login');
      }
    }
  }, [state.isLoading, state.isAuthenticated, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
