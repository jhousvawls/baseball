#!/bin/bash

# Deploy Marketing Site Script
# Builds and deploys the React marketing site to Firebase Hosting

echo "🚀 Deploying Coach's Dugout Marketing Site..."

# Check if we're in the right directory
if [ ! -d "marketing" ]; then
    echo "❌ Error: marketing/ directory not found. Run this script from the project root."
    exit 1
fi

# Navigate to marketing directory
cd marketing

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building marketing site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Go back to root directory
cd ..

echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Marketing site deployed successfully!"
    echo "🔗 Visit: https://baseball-practice-generator.web.app"
else
    echo "❌ Deployment failed. Please check Firebase configuration."
    exit 1
fi
