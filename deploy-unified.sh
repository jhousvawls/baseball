#!/bin/bash

# Unified Deployment Script
# Deploys both marketing site and practice app to Firebase Hosting with proper routing

echo "🚀 Deploying Coach's Dugout - Unified Deployment..."

# Check if we're in the right directory
if [ ! -d "marketing" ] || [ ! -d "app" ]; then
    echo "❌ Error: marketing/ or app/ directory not found. Run this script from the project root."
    exit 1
fi

# Create hosting directory
echo "📁 Creating hosting directory..."
rm -rf hosting
mkdir -p hosting

# Build marketing site
echo "📦 Building marketing site..."
cd marketing
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Marketing site build failed. Please fix errors and try again."
    exit 1
fi

# Copy marketing site to hosting root
echo "📋 Copying marketing site to hosting directory..."
cd ..
cp -r marketing/dist/* hosting/

# Copy app files to hosting/app directory
echo "📋 Copying practice app to hosting/app directory..."
mkdir -p hosting/app
cp -r app/public/* hosting/app/

# Create unified firebase.json for deployment
echo "📝 Creating unified hosting configuration..."

# Backup current firebase.json
cp firebase.json firebase.json.backup

# Create unified firebase.json
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "hosting",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/app/**",
        "destination": "/app/index.html"
      },
      {
        "source": "/app",
        "destination": "/app/index.html"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
EOF

echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Unified deployment successful!"
    echo "🔗 Marketing Site: https://baseball-practice-generator.web.app"
    echo "⚾ Practice App: https://baseball-practice-generator.web.app/app"
    echo "🔧 Admin Panel: https://baseball-practice-generator.web.app/app#admin"
else
    echo "❌ Deployment failed. Please check Firebase configuration."
fi

# Restore original firebase.json
echo "🔄 Restoring original hosting configuration..."
mv firebase.json.backup firebase.json

# Clean up hosting directory
echo "🧹 Cleaning up temporary files..."
rm -rf hosting

if [ $? -eq 0 ]; then
    echo "✅ Deployment complete!"
else
    echo "❌ Failed to restore original configuration."
    exit 1
fi
