# Database Setup

This project uses **Prisma ORM** with **PostgreSQL** for database management, featuring Google OAuth integration, JWT authentication, and comprehensive calendar event management.

## Database Schema

The application includes two main entities with full OAuth and authentication support:

### User Table (`user`)
```sql
- id              INTEGER      PRIMARY KEY (auto-increment)
- username        VARCHAR      UNIQUE (user's display name)  
- email           VARCHAR      UNIQUE (user's email from OAuth)
- first_name      VARCHAR      NULLABLE (user's first name)
- last_name       VARCHAR      NULLABLE (user's last name)
- picture         VARCHAR      NULLABLE (profile picture URL from OAuth)
- google_access_token  VARCHAR NULLABLE (OAuth access token for Google Calendar)
- google_refresh_token VARCHAR NULLABLE (OAuth refresh token)
- created_at      TIMESTAMP    DEFAULT NOW() (user registration time)
```

**Key Features:**
- Google OAuth integration for authentication
- Google Calendar API access token storage
- Profile information from OAuth provider
- Unique constraints on username and email

### Event Table (`event`)
```sql
- id              INTEGER      PRIMARY KEY (auto-increment)
- user_id         INTEGER      FOREIGN KEY → user.id
- title           VARCHAR      NOT NULL (event title)
- description     TEXT         NULLABLE (event description)
- status          VARCHAR      NOT NULL (event status)
- start           TIMESTAMP    NOT NULL (event start time)
- end             TIMESTAMP    NOT NULL (event end time) 
- created_at      TIMESTAMP    DEFAULT NOW() (creation time)
```

**Key Features:**
- Scheduling conflict validation
- Google Calendar synchronization support
- Flexible event status management
- User-specific event ownership

## Relationships & Constraints

### Entity Relationships
- **User ↔ Event**: One-to-Many (user can have multiple events)
- **Event → User**: Many-to-One (each event belongs to one user)

### Database Constraints  
- **Unique Constraints**: `username`, `email` (prevents duplicate accounts)
- **Foreign Key**: `event.user_id` → `user.id` (referential integrity)
- **Index Strategy**: Optimized for user-based event queries
- **Cascading**: Event deletion preserves user data integrity

### Data Validation
- **Email Format**: Validated at application level via OAuth
- **Scheduling Conflicts**: Prevented by `ScheduleConflictValidator`
- **Token Security**: OAuth tokens stored securely with proper encryption
- **Timestamp Consistency**: UTC timestamps for global compatibility

## Environment Configuration

### Development Setup
Configure your local database connection in `apps/backend/.env`:

```bash
# Local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/bullet_calendar"

# Google OAuth (Required for authentication)
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# Application Configuration
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key-change-in-dev"
```

### Docker Setup
For containerized development, configuration is handled automatically via `docker/.env.docker`.

## Available Commands

### Development Workflow
```bash
# Navigate to backend directory
cd apps/backend

# Generate Prisma client after schema changes
npx prisma generate

# Create and apply new migration
npx prisma migrate dev --name "description_of_changes"

# Push schema changes without creating migration (development only)
npx prisma db push

# View and edit database in Prisma Studio
npx prisma studio
```

### Production Deployment
```bash
# Apply migrations to production database
npx prisma migrate deploy

# Generate optimized Prisma client for production
npx prisma generate --no-engine
```

### Database Management
```bash
# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# View current schema
npx prisma db pull

# Seed database (if seed script exists)
npx prisma db seed
```

### Docker Database Commands
```bash
# Start database only
npm run docker:up postgres

# Access PostgreSQL directly
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres -d bullet_calendar

# View database logs
docker-compose -f docker/docker-compose.yml logs postgres

# Reset Docker database (removes all data and volumes)
docker-compose -f docker/docker-compose.yml down -v
```

## Integration & Usage

### Authentication Flow
1. **Google OAuth**: Users authenticate via Google OAuth 2.0
2. **User Creation**: First-time users automatically created with OAuth profile data
3. **Token Storage**: Access and refresh tokens stored securely for Google Calendar API
4. **JWT Session**: Application issues JWT tokens for session management

### Migration History

The application has evolved through several key migrations:

1. **`20251012175609_first_tables`**: Initial User and Event tables
2. **`20251012224945_update_start_and_end_field_for_event`**: Event timestamp field updates  
3. **`20251013142809_add_oauth_fields`**: Added OAuth profile fields to User table
4. **`20251014195741_add_google_tokens`**: Added Google OAuth token storage

### Performance Considerations

- **Indexing**: Primary keys and foreign keys automatically indexed
- **Query Optimization**: Relations loaded selectively to avoid N+1 queries
- **Connection Pooling**: Prisma handles connection pooling automatically  
- **Token Management**: OAuth tokens refreshed automatically when needed
- **Conflict Detection**: Optimized queries for scheduling conflict validation

### Security Features

- **SQL Injection Prevention**: Prisma provides automatic parameterization
- **Token Encryption**: OAuth tokens stored securely in database
- **Access Control**: User-specific data isolation via foreign keys
- **Environment Isolation**: Separate configurations for development/production