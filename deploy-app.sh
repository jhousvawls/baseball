#!/bin/bash

# Deploy Practice App Script
# Deploys the practice generator app files to Firebase Hosting

echo "🚀 Deploying Coach's Dugout Practice App..."

# Check if we're in the right directory
if [ ! -d "app" ]; then
    echo "❌ Error: app/ directory not found. Run this script from the project root."
    exit 1
fi

# Create a temporary hosting configuration for the app
echo "📝 Creating temporary hosting configuration..."

# Backup current firebase.json
cp firebase.json firebase.json.backup

# Create app-specific firebase.json
cat > firebase.json << EOF
{
  "hosting": {
    "public": "app/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOF

echo "🌐 Deploying practice app to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Practice app deployed successfully!"
    echo "🔗 Visit: https://baseball-practice-generator.web.app"
else
    echo "❌ Deployment failed. Please check Firebase configuration."
fi

# Restore original firebase.json
echo "🔄 Restoring original hosting configuration..."
mv firebase.json.backup firebase.json

if [ $? -eq 0 ]; then
    echo "✅ Deployment complete!"
else
    echo "❌ Failed to restore original configuration."
    exit 1
fi
