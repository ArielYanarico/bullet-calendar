const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export async function initiateGoogleLogin(): Promise<void> {
  window.location.href = `${API_BASE_URL}/auth/google`;
}

export async function fetchUserProfile(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.status}`);
  }
  
  return response.json();
}

export async function logout(): Promise<void> {
  // Clear local storage and redirect to logout endpoint
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  window.location.href = `${API_BASE_URL}/auth/logout`;
}

// Token management
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}

export function storeAuthData(token: string, user: AuthUser): void {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuthData(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
