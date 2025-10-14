# API Endpoints

## Prefix

- API prefix is `api`

## Authentication

**Note:** All API endpoints (except authentication endpoints) require authentication via JWT token in the Authorization header: `Authorization: Bearer <jwt_token>`

### Google OAuth Flow

#### GET /auth/google
- **Description**: Initiates Google OAuth authentication flow
- **Authentication**: None required
- **Response**: Redirects to Google OAuth consent page

#### GET /auth/google/callback  
- **Description**: Handles Google OAuth callback (used internally)
- **Authentication**: None required  
- **Response**: Redirects to frontend with JWT token and user data

#### GET /auth/profile
- **Description**: Get current authenticated user profile
- **Authentication**: JWT token required
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: User object
  ```json
  {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com", 
    "firstName": "John",
    "lastName": "Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "createdAt": "2025-10-14T10:00:00.000Z"
  }
  ```

#### GET /auth/logout
- **Description**: Logout user (redirects to frontend login)
- **Authentication**: None required
- **Response**: Redirects to frontend login page

## Users API

**All endpoints require JWT authentication**

### GET /users
- **Description**: Get all users with their events
- **Authentication**: JWT token required
- **Response**: Array of users with their events
  ```json
  [
    {
      "id": 1,
      "username": "user@example.com",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe", 
      "picture": "https://lh3.googleusercontent.com/...",
      "createdAt": "2025-10-14T10:00:00.000Z",
      "events": [...]
    }
  ]
  ```

### GET /users/:id
- **Description**: Get a specific user by ID with their events
- **Authentication**: JWT token required
- **Parameters**: `id` (number) - User ID
- **Response**: User object with events

### POST /users
- **Description**: Create a new user (typically handled by OAuth flow)
- **Authentication**: JWT token required
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string", 
    "picture": "string"   
  }
  ```
- **Response**: Created user object

### PATCH /users/:id
- **Description**: Update a user
- **Authentication**: JWT token required
- **Parameters**: `id` (number) - User ID
- **Body**:
  ```json
  {
    "username": "string", 
    "email": "string",    
    "firstName": "string",
    "lastName": "string", 
    "picture": "string"   
  }
  ```
- **Response**: Updated user object

### DELETE /users/:id
- Description: Delete a user
- Parameters: `id` (number) - User ID
- Response: Deleted user object

## Events API

**All endpoints require JWT authentication**

### GET /events
- **Description**: Get all events with user information  
- **Authentication**: JWT token required
- **Query Parameters**: `userId` (optional) - Filter events by user ID
- **Response**: Array of events with user information
  ```json
  [
    {
      "id": 1,
      "userId": 1,
      "title": "Team Meeting",
      "description": "Weekly team sync",
      "status": "scheduled",
      "start": "2025-10-15T10:00:00.000Z",
      "end": "2025-10-15T11:00:00.000Z",
      "createdAt": "2025-10-14T10:00:00.000Z",
      "user": {
        "id": 1,
        "username": "user@example.com",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
  ```

### GET /events/:id
- **Description**: Get a specific event by ID with user information
- **Authentication**: JWT token required
- **Parameters**: `id` (number) - Event ID
- **Response**: Event object with user information

### POST /events
- **Description**: Create a new event
- **Authentication**: JWT token required
- **Body**:
  ```json
  {
    "userId": "number",
    "title": "string",
    "description": "string",
    "status": "string",
    "start": "date string (ISO format)",
    "end": "date string (ISO format)"
  }
  ```
- **Response**: Created event object with user information

### PATCH /events/:id
- **Description**: Update an event
- **Authentication**: JWT token required
- **Parameters**: `id` (number) - Event ID
- **Body**:
  ```json
  {
    "userId": "number",
    "title": "string",
    "description": "string",
    "status": "string",
    "start": "date string (ISO format)",
    "end": "date string (ISO format)"
  }
  ```
- **Response**: Updated event object with user information

### DELETE /events/:id
- **Description**: Delete an event
- **Authentication**: JWT token required
- **Parameters**: `id` (number) - Event ID
- **Response**: Deleted event object

## Authentication Flow

### 1. Initiate Google OAuth:
```bash
GET /api/auth/google
# Redirects to Google OAuth consent page
```

### 2. After OAuth callback:
```bash
# User is redirected to frontend with JWT token
# Frontend stores token and user data
```

### 3. Use JWT token for API calls:
```bash
# All subsequent requests include the token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Example Usage

**Note**: All examples require JWT token in Authorization header

### Get current user profile:
```bash
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Create an event:
```bash
POST /api/events
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userId": 1,
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "status": "scheduled",
  "start": "2025-10-15T10:00:00.000Z",
  "end": "2025-10-15T11:00:00.000Z"
}
```

### Get all events:
```bash
GET /api/events
Authorization: Bearer <jwt_token>
```

### Get events for specific user:
```bash
GET /api/events?userId=1
Authorization: Bearer <jwt_token>
```

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Causes**: Missing or invalid JWT token

### 403 Forbidden  
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Causes**: Valid token but insufficient permissions

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["field is required", "invalid format"],
  "error": "Bad Request"
}
```
**Causes**: Invalid request body or parameters