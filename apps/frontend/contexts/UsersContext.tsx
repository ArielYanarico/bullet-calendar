'use client';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, fetchUsers, createUser } from '@/lib/api';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}

type UsersAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'SELECT_USER'; payload: User | null }
  | { type: 'CLEAR_ERROR' };

interface UsersContextType {
  state: UsersState;
  actions: {
    loadUsers: () => Promise<void>;
    addUser: (user: Omit<User, 'id' | 'createdAt' | 'events'>) => Promise<void>;
    selectUser: (user: User | null) => void;
    clearError: () => void;
  };
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};

function usersReducer(state: UsersState, action: UsersAction): UsersState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'SELECT_USER':
      return { ...state, selectedUser: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  const actions = {
    loadUsers: async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const users = await fetchUsers();
        dispatch({ type: 'FETCH_SUCCESS', payload: users });
      } catch (error) {
        dispatch({ 
          type: 'FETCH_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to load users' 
        });
      }
    },

    addUser: async (userData: Omit<User, 'id' | 'createdAt' | 'events'>) => {
      try {
        const newUser = await createUser(userData);
        dispatch({ type: 'ADD_USER', payload: newUser });
      } catch (error) {
        dispatch({ 
          type: 'FETCH_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to create user' 
        });
      }
    },

    selectUser: (user: User | null) => {
      dispatch({ type: 'SELECT_USER', payload: user });
    },

    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
  };

  return (
    <UsersContext.Provider value={{ state, actions }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers hook must be used within a UsersProvider context');
  }
  return context;
}
