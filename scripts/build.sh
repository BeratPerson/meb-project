#!/bin/bash

# Build script for Vercel deployment

echo "🔧 Starting build process..."

# Generate Prisma client (skip if no DATABASE_URL)
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Generating Prisma client..."
  npx prisma generate
else
  echo "⚠️ No DATABASE_URL found, skipping Prisma generate"
fi

# Build Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!" 