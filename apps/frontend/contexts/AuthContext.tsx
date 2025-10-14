'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, fetchUserProfile, getStoredToken, getStoredUser, storeAuthData, clearAuthData } from '../lib/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUTH'; payload: { user: AuthUser; token: string } }
  | { type: 'CLEAR_AUTH' }
  | { type: 'UPDATE_USER'; payload: AuthUser };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_AUTH':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  actions: {
    setAuth: (user: AuthUser, token: string) => void;
    clearAuth: () => void;
    updateUser: (user: AuthUser) => void;
    clearError: () => void;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAuth = (user: AuthUser, token: string) => {
    storeAuthData(token, user);
    dispatch({ type: 'SET_AUTH', payload: { user, token } });
  };

  const clearAuth = () => {
    clearAuthData();
    dispatch({ type: 'CLEAR_AUTH' });
  };

  const updateUser = (user: AuthUser) => {
    if (state.token) {
      storeAuthData(state.token, user);
    }
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
          try {
            const user = await fetchUserProfile(storedToken);
            dispatch({ type: 'SET_AUTH', payload: { user, token: storedToken } });
          } catch (error) {
            clearAuthData();
            dispatch({ type: 'CLEAR_AUTH' });
          }
        } else {
          dispatch({ type: 'CLEAR_AUTH' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'CLEAR_AUTH' });
      }
    };

    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    state,
    actions: {
      setAuth,
      clearAuth,
      updateUser,
      clearError,
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
