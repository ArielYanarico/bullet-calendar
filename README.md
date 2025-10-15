# Bullet Calendar

A modern bullet journal calendar application with **Google OAuth authentication** and **Google Calendar integration**.

## Features

✨ **Google OAuth Authentication** - Secure login with your Google account  
📅 **Google Calendar Integration** - Sync with your existing Google Calendar events  
⚡ **Scheduling Conflict Prevention** - Automatic conflict detection across all calendars  
🐳 **Docker Ready** - Complete containerized deployment  
🔒 **JWT Authentication** - Secure API access with JSON Web Tokens  

## Quick Start

### Development Mode
```bash
npm install
npm run dev
```
Access: [Frontend](http://localhost:3000) | [Backend API](http://localhost:3001/api)

### Docker Deployment
```bash
# Copy and configure environment
cp docker/.env.docker.example docker/.env.docker
# Edit docker/.env.docker with your Google OAuth credentials

# Start everything
npm run docker:dev
```

## Architecture

**Monorepo Structure:**
- **Backend** (`apps/backend`): NestJS API with Prisma ORM
- **Frontend** (`apps/frontend`): Next.js React application

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Google Cloud Console project (for OAuth credentials)

## Development Commands

```bash
# Install dependencies
npm install

# Development mode (both apps)
npm run dev

# Individual apps
npm run backend:dev
npm run frontend:dev

# Build for production
npm run build

# Run tests
npm test
```

## Docker Commands

```bash
# Complete setup with database
npm run docker:dev

# Production deployment
npm run docker:up
npm run docker:down

# View logs
npm run docker:logs
```

## Tech Stack

**Backend:** NestJS + TypeScript + Prisma + PostgreSQL + Google OAuth  
**Frontend:** Next.js + TypeScript + CSS Modules  
**Infrastructure:** Docker + Docker Compose  

## Documentation

📖 **[API Reference](docs/API.md)** - Complete API endpoints and authentication  
🗄️ **[Database Guide](docs/DATABASE.md)** - Schema, migrations, and Prisma setup  
🐳 **[Docker Setup](docs/DOCKER.md)** - Containerization and deployment guide  

## Project Structure

```
bullet-calendar/
├── apps/
│   ├── backend/          # NestJS API (port 3001)
│   └── frontend/         # Next.js app (port 3000)
├── docker/               # Docker configuration
├── docs/                 # Documentation
└── package.json          # Workspace configuration
```

## Technical Debts

- [ ] Add and update unit tests
- [ ] Use nest validations in DTOs for validating requests
- [ ] Add endpoint documentaion using Swagger
- [ ] Refactor console logs in order to use nest logger
- [ ] Improve Auth module to handle google refresh token (research)

## License

MIT License - see the [LICENSE](LICENSE) file for details

