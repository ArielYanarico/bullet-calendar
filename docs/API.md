# API Endpoints

## Prefix

- API prefix is `api`

## Users API

### GET /users
- Description: Get all users with their events
- Response: Array of users with their events

### GET /users/:id
- Description: Get a specific user by ID with their events
- Parameters: `id` (number) - User ID
- Response: User object with events

### POST /users
- Description: Create a new user
- Body:
  ```json
  {
    "username": "string"
  }
  ```
- Response: Created user object

### PATCH /users/:id
- Description: Update a user
- Parameters: `id` (number) - User ID
- Body:
  ```json
  {
    "username": "string" // optional
  }
  ```
- Response: Updated user object

### DELETE /users/:id
- Description: Delete a user
- Parameters: `id` (number) - User ID
- Response: Deleted user object

## Events API

### GET /events
- Description: Get all events with user information
- Query Parameters: `userId` (optional) - Filter events by user ID
- Response: Array of events with user information

### GET /events/:id
- Description: Get a specific event by ID with user information
- Parameters: `id` (number) - Event ID
- Response: Event object with user information

### POST /events
- Description: Create a new event
- Body:
  ```json
  {
    "userId": "number",
    "title": "string",
    "description": "string", // optional
    "status": "string",
    "start": "date string (ISO format)",
    "end": "date string (ISO format)"
  }
  ```
- Response: Created event object with user information

### PATCH /events/:id
- Description: Update an event
- Parameters: `id` (number) - Event ID
- Body:
  ```json
  {
    "userId": "number", // optional
    "title": "string", // optional
    "description": "string", // optional
    "status": "string", // optional
    "start": "date string (ISO format)", // optional
    "end": "date string (ISO format)" // optional
  }
  ```
- Response: Updated event object with user information

### DELETE /events/:id
- Description: Delete an event
- Parameters: `id` (number) - Event ID
- Response: Deleted event object

## Example Usage

### Create a user:
```bash
POST /api/users
{
  "username": "john_doe"
}
```

### Create an event for the user:
```bash
POST /api/events
{
  "userId": 1,
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "status": "scheduled",
  "start": "2025-10-15T10:00:00Z",
  "end": "2025-10-15T11:00:00Z"
}
```

### Get all events for a specific user:
```bash
GET /api/events?userId=1
```