'use client';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Event, fetchEventsWithGoogle, createEvent, updateEvent } from '@/lib/api';

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

type EventsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Event[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }  
  | { type: 'CLEAR_ERROR' };

interface EventsContextType {
  state: EventsState;
  actions: {
    loadEvents: () => Promise<void>;
    addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'user' | 'userId'>) => Promise<void>;
    updateEvent: (event: Omit<Event, 'createdAt' | 'user' | 'userId'>) => Promise<void>;
    clearError: () => void;
  };
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

function eventsReducer(state: EventsState, action: EventsAction): EventsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, events: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event => event.id === action.payload.id ? action.payload : event)
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const actions = {
    loadEvents: async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const events = await fetchEventsWithGoogle();
        dispatch({ type: 'FETCH_SUCCESS', payload: events });
      } catch (error) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to load events'
        });
      }
    },

    addEvent: async (eventData: Omit<Event, 'id' | 'createdAt' | 'user' | 'userId'>) => {
      try {
        const newEvent = await createEvent(eventData);
        dispatch({ type: 'ADD_EVENT', payload: newEvent });
      } catch (error) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to create event'
        });
      }
    },

    updateEvent: async (oldEvent: Omit<Event, 'createdAt' | 'user' | 'userId'>) => {
      try {
         const newEvent = await updateEvent(oldEvent);
        dispatch({ type: 'UPDATE_EVENT', payload: newEvent });
      } catch (error) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to update event'
        });
      }
    },

    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
  };

  return (
    <EventsContext.Provider value={{ state, actions }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents hook must be used within an EventsProvider context');
  }
  return context;
}
