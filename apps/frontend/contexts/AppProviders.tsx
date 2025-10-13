'use client';
import { ReactNode } from 'react';
import { EventsProvider } from './EventsContext';
import { UsersProvider } from './UsersContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UsersProvider>
      <EventsProvider>
        {children}
      </EventsProvider>
    </UsersProvider>
  );
}

export { useEvents } from './EventsContext';
export { useUsers } from './UsersContext';
