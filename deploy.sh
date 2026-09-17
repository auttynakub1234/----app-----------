#!/bin/bash

# SKM Wellness App - Quick Deployment Script
# This script helps you deploy the app to Vercel with one command

echo "🚀 SKM Wellness App - Deployment Helper"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Please create .env file with your Supabase credentials:"
    echo ""
    echo "VITE_SUPABASE_URL=https://xxxxx.supabase.co"
    echo "VITE_SUPABASE_ANON_KEY=eyJhbG..."
    echo ""
    echo "Copy from .env.example and fill in your values."
    exit 1
fi

# Ask user if they want to deploy
echo ""
echo "🤔 Ready to deploy to Vercel?"
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Deploying to Vercel..."
    vercel --prod

    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Your app is now live!"
else
    echo "❌ Deployment cancelled."
fi
