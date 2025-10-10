# Bullet Calendar

A modern bullet journal calendar application built with a monorepo architecture.

## Architecture

This project is organized as a monorepo containing:

- **Backend** (`apps/backend`): NestJS API server
- **Frontend** (`apps/frontend`): Next.js web application (without Tailwind CSS)

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

## Getting Started

### Installation

Install all dependencies:

```bash
npm install
```

### Development

Run both backend and frontend in development mode:

```bash
npm run dev
```

Or run them individually:

```bash
# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev
```

### Building

Build both applications:

```bash
npm run build
```

Or build them individually:

```bash
# Backend only
npm run backend:build

# Frontend only
npm run frontend:build
```

### Testing

Run tests for all applications:

```bash
npm test
```

Or run tests individually:

```bash
# Backend tests
npm run backend:test

# Frontend tests
npm run frontend:test
```

## Project Structure

```
bullet-calendar/
├── apps/
│   ├── backend/          # NestJS backend application
│   └── frontend/         # Next.js frontend application
├── package.json          # Root package.json with workspace configuration
└── README.md            # This file
```

## Tech Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Runtime**: Node.js

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: CSS Modules (no Tailwind)
- **UI Library**: React

## License

MIT License - see the [LICENSE](LICENSE) file for details

