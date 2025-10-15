# Docker Setup for Bullet Calendar

This Docker configuration allows you to run the entire Bullet Calendar monorepo with a single command.

## 🐳 Quick Start

1. **Navigate to Docker Directory**
   ```bash
   cd docker
   ```

2. **Configure Environment Variables**
   ```bash
   # Edit .env.docker with your actual values
   cp .env.docker.example .env.docker
   ```

3. **Build and Run**
   ```bash
   # From root directory
   npm run docker:dev
   
   # Or from docker directory
   docker-compose up --build
   ```

4. **Access Applications**
   - 🌐 Frontend: http://localhost:3000
   - 🔧 Backend API: http://localhost:3001
   - 🗄️ PostgreSQL: localhost:5432

## 📋 Available Docker Commands

From root directory:
```bash
npm run docker:build    # Build Docker images
npm run docker:up       # Start services in background
npm run docker:down     # Stop services
npm run docker:logs     # View application logs
npm run docker:restart  # Restart application service
npm run docker:dev      # Build and start with logs
```

From docker directory:
```bash
# Using Docker Compose directly
docker-compose build
docker-compose up -d
docker-compose down
docker-compose logs -f app

# Using convenience scripts
./scripts.sh dev      # Linux/Mac
scripts.bat dev       # Windows
```

## 🏗️ What Gets Built

The Docker setup includes:
- ✅ **PostgreSQL Database** - Persistent data storage
- ✅ **NestJS Backend** - API server on port 3001
- ✅ **Next.js Frontend** - Web app on port 3000
- ✅ **Prisma Migrations** - Auto-applied on startup
- ✅ **Health Checks** - Ensures services are ready

## 🔧 Configuration

### Environment Variables (.env.docker)
```bash
# Database
DATABASE_URL="postgresql://postgres:postgres123@postgres:5432/bullet_calendar"

# Google OAuth (required for authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application URLs
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Service Dependencies
The startup process ensures proper order:
1. PostgreSQL starts and becomes healthy
2. Prisma migrations are applied
3. Backend and Frontend start simultaneously

## 🐛 Troubleshooting

**View Logs:**
```bash
# From root
npm run docker:logs

# From docker directory
docker-compose logs -f app
```

**Check Service Health:**
```bash
docker-compose ps
```

**Restart Services:**
```bash
# From root
npm run docker:restart

# From docker directory
docker-compose restart app
```

**Clean Restart:**
```bash
# From root
npm run docker:down
npm run docker:dev

# From docker directory
docker-compose down
docker-compose up --build
```

## 📁 Docker Files Structure

```
docker/
├── Dockerfile           # Multi-stage build for optimized image
├── docker-compose.yml   # Service orchestration
├── start.sh            # Startup script with migrations
├── .dockerignore       # Build optimization
├── .env.docker         # Docker environment configuration
└── README.md           # This documentation
```

## 🚀 Production Deployment

1. Copy the `docker/` folder to your production server
2. Update `docker/.env.docker` with production values
3. Run: `docker-compose up -d`

The container is production-ready with:
- Optimized multi-stage builds
- Non-root user execution
- Health checks and restart policies
- Persistent volume management