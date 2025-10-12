# Docker PostgreSQL Setup

This project includes a Docker Compose configuration to run PostgreSQL locally for development.

## What's Included

- **PostgreSQL 16** (latest version) running on port 5432
- Persistent data storage with Docker volumes
- Pre-configured database: `bullet_calendar`

## Quick Start

1. **Start the PostgreSQL database:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations:**
   ```bash
   cd apps/backend
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

## Database Access

### Connection Details
- **Host:** localhost
- **Port:** 5432
- **Database:** bullet_calendar
- **Username:** postgres
- **Password:** postgres

### Connection String
```
postgresql://postgres:postgres@localhost:5432/bullet_calendar?schema=public
```

## Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs postgres

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d

# Run postgres server only
docker-compose up -d postgres

# Execute SQL commands directly
docker-compose exec postgres psql -U postgres -d bullet_calendar
```

## Environment Configuration

The backend is configured to use the Docker PostgreSQL instance by default. You can switch between different database connections by editing `apps/backend/.env`:

- **Docker PostgreSQL:** `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bullet_calendar?schema=public"`

## Data Persistence

Database data is stored in the `postgres_data` Docker volume, so your data will persist between container restarts. To completely reset the database, use:

```bash
docker-compose down -v
```