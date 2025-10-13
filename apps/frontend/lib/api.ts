const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }
  
  return response.json();
}

export async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'user'>): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create event: ${response.status}`);
  }
  
  return response.json();
}

export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'events'>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`);
  }
  
  return response.json();
}
