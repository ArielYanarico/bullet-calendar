const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

export interface User {
  id: number;
  username: string;
  createdAt: string;
  events?: Event[];
}

export interface Event {
  id: number;
  userId: number;
  title: string;
  description?: string;
  status: string;
  start: string;
  end: string;
  createdAt: string;
  user?: User;
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    cache: 'no-store',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch events: ${errorData.message}`);
  }

  return response.json();
}

export async function fetchEventsWithGoogle(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events/with-google`, {
    cache: 'no-store',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch events with Google integration: ${errorData.message}`);
  }
  
  return response.json();
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    cache: 'no-store',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch users: ${errorData.message}`);
  }
  
  return response.json();
}

export async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'user' | 'userId'>): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(event),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create event: ${errorData.message}`);
  }
  
  return response.json();
}

export async function updateEvent(event: Omit<Event, 'createdAt' | 'user' | 'userId'>): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update event: ${errorData.message}`);
  }

  return response.json();
}

export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'events'>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create user: ${errorData.message}`);
  }
  
  return response.json();
}
