#!/bin/sh

echo "🚀 Starting Bullet Calendar Application..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ PostgreSQL is ready!"

# Run Prisma migrations
echo "🗄️ Running Prisma migrations..."
cd /app/apps/backend

# Check if migrations exist
echo "📁 Checking for migration files..."
ls -la prisma/migrations/ || echo "No migrations directory found"

# Check environment variables
echo "🔍 Database URL: $DATABASE_URL"

# Push schema to database (creates tables if they don't exist)
echo "📤 Pushing Prisma schema to database..."
npx prisma db push --accept-data-loss
if [ $? -eq 0 ]; then
    echo "✅ Prisma schema push completed successfully!"
else
    echo "❌ Prisma schema push failed!"
    echo "Trying migrate deploy as fallback..."
    npx prisma migrate deploy
fi

# Generate Prisma client (in case it's needed)
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🔧 Starting applications..."

# Start both backend and frontend in background
cd /app

# Start backend
echo "🚀 Starting NestJS Backend on port 3001..."
cd /app/apps/backend && npm run start:prod &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

# Start frontend  
echo "🚀 Starting Next.js Frontend on port 3000..."
cd /app/apps/frontend && npm run start &
FRONTEND_PID=$!

# Function to handle shutdown
shutdown() {
    echo "🛑 Shutting down applications..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Applications stopped"
    exit 0
}

# Set up signal handlers
trap shutdown SIGTERM SIGINT

echo "✅ All services started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID