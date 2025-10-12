# Database Setup

This project uses Prisma ORM with PostgreSQL for database management.

## Database Schema

The application includes two main entities:

### User Table
- `id`: Primary key (auto-increment)
- `username`: String
- `created_at`: Timestamp (auto-generated)

### Event Table
- `id`: Primary key (auto-increment)
- `user_id`: Foreign key referencing User.id
- `title`: String
- `description`: Text (optional)
- `status`: String
- `start_at`: Timestamp
- `finish_at`: Timestamp
- `created_at`: Timestamp (auto-generated)

## Relationships
- User has many Events (one-to-many)
- Event belongs to User (many-to-one)

## Available Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Apply database migrations
npx prisma migrate dev --name init

# View your database in Prisma Studio
npx prisma studio

# Push schema changes to database (development)
npx prisma db push

# Reset database (caution: this will delete all data)
npx prisma migrate reset
```

## Usage Examples

The `AppService` includes example methods demonstrating:
- Creating users and events
- Querying with relations
- Type-safe database operations

Access Prisma client in any service by injecting `PrismaService`.