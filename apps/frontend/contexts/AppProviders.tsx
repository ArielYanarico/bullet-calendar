'use client';
import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { EventsProvider } from './EventsContext';
import { UsersProvider } from './UsersContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <UsersProvider>
        <EventsProvider>
          {children}
        </EventsProvider>
      </UsersProvider>
    </AuthProvider>
  );
}

export { useAuth } from './AuthContext';
export { useEvents } from './EventsContext';
export { useUsers } from './UsersContext';
