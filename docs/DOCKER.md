# Docker Setup

This project includes a complete Docker containerization setup for both development and production deployment.

## What's Included

- **Complete Monorepo Containerization**: Both NestJS backend and Next.js frontend in a single container
- **PostgreSQL 16** database with health checks
- **Multi-stage Docker build** for optimized production images  
- **Automatic database migrations** and schema synchronization
- **Production-ready configuration** with proper networking and volumes
- **Development and production environment support**

## Quick Start

### Development Mode (Recommended)

1. **Configure environment variables:**
   ```bash
   # Copy and configure Docker environment
   cp docker/.env.docker.example docker/.env.docker
   # Edit docker/.env.docker with your Google OAuth credentials
   ```

2. **Start the complete application:**
   ```bash
   npm run docker:dev
   ```
   This command will:
   - Build the Docker images
   - Start PostgreSQL with health checks
   - Apply database schema automatically
   - Start both backend (port 3001) and frontend (port 3000)

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

### Production Mode

1. **Build and start services:**
   ```bash
   npm run docker:build
   npm run docker:up
   ```

2. **Or use individual commands:**
   ```bash
   # Build images only
   docker-compose -f docker/docker-compose.yml build
   
   # Start services in background
   docker-compose -f docker/docker-compose.yml up -d
   ```

## Services

### Application Container (`bullet-calendar-app`)
- **Frontend**: Next.js application on port 3000
- **Backend**: NestJS API server on port 3001  
- **Features**: Automatic database migrations, Google OAuth, JWT authentication
- **Health Check**: Verifies frontend availability

### Database Container (`bullet-calendar-postgres`)
- **Host**: localhost (external) / postgres (internal Docker network)
- **Port**: 5432
- **Database**: bullet_calendar
- **Username**: postgres
- **Password**: Configured in `docker/.env.docker`
- **Health Check**: PostgreSQL readiness check

### Connection Details (External Access)
```bash
# For external database tools
Host: localhost
Port: 5432
Database: bullet_calendar
Username: postgres
Password: [from docker/.env.docker]

# Connection String (External)
postgresql://postgres:[password]@localhost:5432/bullet_calendar?schema=public
```

## Docker Commands

### NPM Scripts (Recommended)

```bash
# Development - Build and run with live reload
npm run docker:dev

# Production - Start services in background  
npm run docker:up

# Stop all services
npm run docker:down

# View application logs
npm run docker:logs

# Restart application container
npm run docker:restart

# Build images only
npm run docker:build
```

### Direct Docker Compose Commands

```bash
# Start services (from project root)
docker-compose -f docker/docker-compose.yml up -d

# Stop services and remove containers
docker-compose -f docker/docker-compose.yml down

# Stop and remove volumes (DELETES ALL DATA)
docker-compose -f docker/docker-compose.yml down -v

# View logs for all services
docker-compose -f docker/docker-compose.yml logs -f

# View logs for specific service
docker-compose -f docker/docker-compose.yml logs -f app
docker-compose -f docker/docker-compose.yml logs -f postgres

# Execute commands in containers
docker-compose -f docker/docker-compose.yml exec app sh
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres -d bullet_calendar

# Rebuild and restart
docker-compose -f docker/docker-compose.yml up --build
```

## Environment Configuration

### Docker Environment File

Configure Docker deployment by editing `docker/.env.docker`:

```bash
# PostgreSQL Configuration  
POSTGRES_DB=bullet_calendar
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password-here

# Database URL (internal Docker network)
DATABASE_URL="postgresql://postgres:your-secure-password-here@postgres:5432/bullet_calendar?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars

# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Environment
NODE_ENV=production
```

### Development vs Production

- **Development**: Use `npm run docker:dev` - includes build output and live rebuilding
- **Production**: Use `npm run docker:up` - optimized images and performance

## Data Persistence & Troubleshooting

### Database Volumes

Database data is stored in the `docker_postgres_data` Docker volume and persists between container restarts.

```bash
# List Docker volumes
docker volume ls

# Inspect volume
docker volume inspect docker_postgres_data

# Complete reset (DELETES ALL DATA)
npm run docker:down
docker-compose -f docker/docker-compose.yml down -v
npm run docker:dev
```

### Troubleshooting

#### Database Connection Issues
```bash
# Check if PostgreSQL is ready
docker-compose -f docker/docker-compose.yml exec postgres pg_isready -U postgres

# Check database credentials
docker-compose -f docker/docker-compose.yml logs postgres

# Reset database with fresh credentials
docker-compose -f docker/docker-compose.yml down -v
npm run docker:dev
```

#### Application Issues
```bash
# View application logs
npm run docker:logs

# Restart just the app container
npm run docker:restart

# Check container status
docker-compose -f docker/docker-compose.yml ps

# Exec into container for debugging
docker-compose -f docker/docker-compose.yml exec app sh
```

#### Build Issues
```bash
# Clean build (removes cached layers)
docker-compose -f docker/docker-compose.yml build --no-cache

# Remove all containers and volumes
docker-compose -f docker/docker-compose.yml down -v
docker system prune -a
npm run docker:dev
```

## Architecture Details

### Multi-Stage Docker Build
- **Base Stage**: Node.js Alpine Linux
- **Dependencies Stage**: Install and cache dependencies  
- **Builder Stage**: Build both backend and frontend applications
- **Runner Stage**: Production runtime with minimal footprint

### Networking
- **Internal Network**: `bullet-calendar-network` for container communication
- **External Ports**: 3000 (frontend), 3001 (backend), 5432 (database)

### Health Checks
- **PostgreSQL**: `pg_isready` command ensures database availability
- **Application**: HTTP check on frontend port ensures app readiness
- **Dependency Management**: App waits for healthy PostgreSQL before starting

### Automatic Features
- **Database Schema**: Automatically applied via Prisma on startup
- **Migrations**: Handled by `npx prisma db push` in startup script  
- **Client Generation**: Prisma client generated during build process
- **Process Management**: Graceful shutdown handling for both services