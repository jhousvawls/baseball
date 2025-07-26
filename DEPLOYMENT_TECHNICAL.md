# 🔧 Coach's Dugout - Technical Deployment Documentation

Comprehensive technical documentation for the unified deployment solution.

## 📋 Overview

This document provides detailed technical information about the Coach's Dugout deployment architecture, troubleshooting, and maintenance procedures.

## 🏗️ Architecture Details

### **Monorepo Structure**
```
baseball/
├── marketing/                   # React + TypeScript marketing site
│   ├── dist/                   # Build output (generated)
│   ├── src/                    # Source code
│   ├── package.json           # Dependencies
│   └── vite.config.ts         # Build configuration
├── app/                        # Vanilla JS practice app
│   ├── public/                # Static files (deployed)
│   └── src/                   # Development files
├── shared/                     # Shared configurations
│   └── config/firebase.js     # Firebase config
├── deploy-unified.sh          # Unified deployment script
├── deploy-marketing.sh        # Marketing-only deployment
├── deploy-app.sh             # App-only deployment
└── firebase.json             # Firebase hosting config
```

### **Deployment Flow**

#### **Unified Deployment Process**
1. **Validation**: Check for required directories (`marketing/`, `app/`)
2. **Clean Setup**: Remove any existing `hosting/` directory
3. **Marketing Build**: 
   - `cd marketing && npm install`
   - `npm run build` (creates `marketing/dist/`)
4. **Directory Assembly**:
   - Create temporary `hosting/` directory
   - Copy `marketing/dist/*` to `hosting/` (root level)
   - Copy `app/public/*` to `hosting/app/` (subdirectory)
5. **Firebase Configuration**:
   - Backup original `firebase.json`
   - Generate deployment-specific config with proper rewrites
6. **Deployment**: `firebase deploy --only hosting`
7. **Cleanup**: Restore original config, remove temporary files

#### **Directory Structure During Deployment**
```
hosting/ (temporary)
├── index.html                  # Marketing site entry
├── assets/
│   ├── index-[hash].css       # Compiled marketing CSS
│   └── index-[hash].js        # Compiled marketing JS
├── vite.svg                   # Marketing assets
└── app/                       # Practice app subdirectory
    ├── index.html             # App entry point
    ├── css/
    │   ├── main.css
    │   ├── components.css
    │   └── print.css
    ├── js/
    │   ├── app.js
    │   ├── config/firebase.js
    │   ├── modules/
    │   └── utils/
    └── [other app assets]
```

## 🔄 Firebase Hosting Configuration

### **Deployment-Time Configuration**
```json
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
```

### **Original Configuration (Restored After Deployment)**
```json
{
  "hosting": {
    "public": "marketing/dist",
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
    ]
  }
}
```

## 🛠️ Script Analysis

### **deploy-unified.sh Breakdown**

#### **Error Handling**
```bash
# Directory validation
if [ ! -d "marketing" ] || [ ! -d "app" ]; then
    echo "❌ Error: marketing/ or app/ directory not found."
    exit 1
fi

# Build validation
if [ $? -ne 0 ]; then
    echo "❌ Marketing site build failed."
    exit 1
fi
```

#### **Build Process**
```bash
# Marketing site build
cd marketing
npm install                    # Ensure dependencies
npm run build                 # Vite build to dist/

# Validation
if [ $? -ne 0 ]; then
    echo "❌ Marketing site build failed."
    exit 1
fi
```

#### **File Operations**
```bash
# Create hosting structure
rm -rf hosting                # Clean slate
mkdir -p hosting              # Create hosting directory

# Copy files
cp -r marketing/dist/* hosting/     # Marketing to root
mkdir -p hosting/app                # Create app subdirectory
cp -r app/public/* hosting/app/     # App to subdirectory
```

#### **Configuration Management**
```bash
# Backup and replace
cp firebase.json firebase.json.backup

# Generate deployment config
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "hosting",
    ...
  }
}
EOF

# Restore after deployment
mv firebase.json.backup firebase.json
```

## 🔍 Troubleshooting Guide

### **Common Issues and Solutions**

#### **1. Build Failures**

**Marketing Site Build Errors**
```bash
# Symptoms
❌ Marketing site build failed. Please fix errors and try again.

# Solutions
cd marketing
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

**Node.js Version Issues**
```bash
# Check Node version
node --version

# Should be 16+ (recommended 18+)
# Use nvm to switch versions
nvm use 18
```

#### **2. Permission Errors**

**npm Permission Issues**
```bash
# Symptoms
EACCES: permission denied, mkdir '/usr/local/lib/node_modules'

# Solutions
sudo chown -R $(id -u):$(id -g) ~/.npm
npm cache clean --force
```

**File Permission Issues**
```bash
# Make scripts executable
chmod +x deploy-unified.sh
chmod +x deploy-marketing.sh
chmod +x deploy-app.sh
```

#### **3. Firebase Issues**

**Authentication Problems**
```bash
# Re-authenticate
firebase logout
firebase login

# Verify project access
firebase projects:list
firebase use baseball-practice-generator
```

**Deployment Failures**
```bash
# Check hosting configuration
firebase hosting:channel:list

# Verify project settings
firebase use --add

# Test deployment (dry run)
firebase deploy --only hosting --dry-run
```

#### **4. Routing Issues**

**App Not Loading at /app**
- Verify `hosting/app/` directory exists after build
- Check Firebase rewrites configuration
- Ensure `app/index.html` exists in deployment

**Marketing Site Not Loading**
- Verify `hosting/index.html` exists
- Check marketing build output in `marketing/dist/`
- Ensure Vite build completed successfully

### **Debugging Commands**

#### **Verify Build Output**
```bash
# Check marketing build
ls -la marketing/dist/

# Check app files
ls -la app/public/

# Check hosting structure (during deployment)
ls -la hosting/
ls -la hosting/app/
```

#### **Firebase Debugging**
```bash
# Check current project
firebase use

# List hosting sites
firebase hosting:sites:list

# View deployment history
firebase hosting:channel:list

# Check hosting configuration
cat firebase.json
```

#### **Network Debugging**
```bash
# Test URLs
curl -I https://baseball-practice-generator.web.app
curl -I https://baseball-practice-generator.web.app/app

# Check DNS
nslookup baseball-practice-generator.web.app
```

## 📊 Performance Monitoring

### **Build Performance**
```bash
# Marketing build time
time npm run build:marketing

# Deployment time
time ./deploy-unified.sh
```

### **Bundle Analysis**
```bash
# Analyze marketing bundle
cd marketing
npm run build -- --analyze

# Check bundle sizes
ls -lh dist/assets/
```

### **Hosting Performance**
- **Firebase Console**: Performance monitoring
- **Lighthouse**: Core Web Vitals
- **GTmetrix**: Load time analysis

## 🔐 Security Considerations

### **API Keys**
- YouTube API key: Managed in Firebase environment
- OpenAI API key: Managed in Firebase environment
- Firebase config: Public (client-side safe)

### **Authentication**
- Firebase Auth with Google Sign-In
- Role-based access control
- Firestore security rules

### **Hosting Security**
```json
{
  "headers": [
    {
      "source": "**",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🚀 Optimization Strategies

### **Build Optimization**
- **Marketing**: Vite tree shaking and code splitting
- **App**: Manual optimization for vanilla JS
- **Assets**: Image compression and lazy loading

### **Caching Strategy**
```json
{
  "headers": [
    {
      "source": "**/*.@(js|css)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=31536000"
        }
      ]
    },
    {
      "source": "**/*.@(html|json)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=0"
        }
      ]
    }
  ]
}
```

### **CDN Optimization**
- Firebase CDN for global distribution
- Automatic compression (gzip/brotli)
- HTTP/2 support

## 📈 Monitoring and Maintenance

### **Regular Maintenance Tasks**

#### **Weekly**
- Check deployment logs
- Monitor performance metrics
- Review error reports

#### **Monthly**
- Update dependencies
- Security audit
- Performance optimization review

#### **Quarterly**
- Firebase quota review
- Cost optimization
- Feature usage analysis

### **Monitoring Tools**
- **Firebase Console**: Hosting analytics
- **Google Analytics**: User behavior
- **Firebase Performance**: Core Web Vitals
- **Firebase Crashlytics**: Error tracking

## 🔄 Rollback Procedures

### **Emergency Rollback**
```bash
# Quick rollback to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION_ID TARGET_SITE_ID

# Or redeploy from Git
git checkout previous-working-commit
npm run deploy
```

### **Gradual Rollback**
```bash
# Deploy to preview channel first
firebase hosting:channel:deploy preview

# Test preview
# If good, promote to live
firebase hosting:channel:clone preview:CHANNEL_ID live
```

## 📞 Support and Escalation

### **Internal Support**
1. Check this documentation
2. Review deployment logs
3. Test locally first
4. Check Firebase Console

### **External Support**
- **Firebase Support**: Console → Support
- **GitHub Issues**: Repository issues
- **Community**: Stack Overflow, Firebase Discord

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: Coach's Dugout Development Team
