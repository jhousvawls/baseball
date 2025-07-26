# 🚀 Coach's Dugout Deployment Guide

Quick reference for deploying the Coach's Dugout monorepo.

## 🌐 Live URLs

- **🏠 Marketing Site**: https://baseball-practice-generator.web.app
- **⚾ Practice App**: https://baseball-practice-generator.web.app/app
- **🔧 Admin Panel**: https://baseball-practice-generator.web.app/app#admin

## ⚡ Quick Deploy Commands

### **Deploy Both Sites (Unified - Recommended)**
```bash
npm run deploy
# or
npm run deploy:unified
# or
./deploy-unified.sh
```

### **Deploy Marketing Site Only**
```bash
npm run deploy:marketing
```

### **Deploy Practice App Only**
```bash
npm run deploy:app
```

## 🔄 Unified Deployment Solution

### **What is Unified Deployment?**
The unified deployment (`deploy-unified.sh`) solves the routing issue by deploying both the marketing site and practice app to the same Firebase hosting with proper directory structure and routing configuration.

### **How It Works**
1. **Builds Marketing Site**: Compiles React + TypeScript to `marketing/dist/`
2. **Creates Hosting Directory**: Temporary `hosting/` directory for deployment
3. **Copies Marketing Files**: Marketing site files go to hosting root
4. **Copies App Files**: Practice app files go to `hosting/app/` subdirectory
5. **Configures Routing**: Updates Firebase hosting config with proper rewrites
6. **Deploys Everything**: Single deployment with both sites
7. **Cleans Up**: Removes temporary files and restores original config

### **Directory Structure After Deployment**
```
Firebase Hosting Root/
├── index.html              # Marketing site (React)
├── assets/                 # Marketing site assets
│   ├── index-[hash].css   # Compiled CSS
│   └── index-[hash].js    # Compiled JavaScript
└── app/                    # Practice app subdirectory
    ├── index.html         # Practice app entry point
    ├── css/               # Practice app styles
    ├── js/                # Practice app JavaScript
    └── ...                # Other app assets
```

### **Firebase Routing Configuration**
```json
{
  "hosting": {
    "public": "hosting",
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

### **Why Unified Deployment?**
- **Single Domain**: Both sites served from same domain
- **Proper Routing**: `/app` routes work correctly
- **Cost Effective**: One Firebase hosting project
- **Simplified Management**: Single deployment process
- **SEO Benefits**: Unified domain authority
- **User Experience**: Seamless navigation between sites

## 🔧 First-Time Setup

### **1. Prerequisites**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Verify project
firebase projects:list
```

### **2. Fix npm Permissions (if needed)**
```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
```

### **3. Install Dependencies**
```bash
# Root dependencies
npm install

# Marketing site dependencies
npm run install:marketing
```

## 🛠️ Development Workflow

### **Marketing Site Development**
```bash
# Start development server
npm run dev:marketing

# Build for production
npm run build:marketing

# Deploy
npm run deploy:marketing
```

### **Practice App Development**
```bash
# Serve locally
cd app && python -m http.server 8000

# Deploy
npm run deploy:app
```

## 🔍 Troubleshooting

### **Build Errors**
```bash
# Clean and reinstall
cd marketing
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### **Permission Errors**
```bash
# Fix npm cache
sudo chown -R $(id -u):$(id -g) ~/.npm
npm cache clean --force
```

### **Firebase Issues**
```bash
# Re-login
firebase logout
firebase login

# Check configuration
firebase use --add
```

## 📋 Deployment Checklist

### **Before Deploying**
- [ ] Code committed to Git
- [ ] Dependencies installed
- [ ] Build passes locally
- [ ] Firebase CLI authenticated

### **Marketing Site**
- [ ] `npm run build:marketing` succeeds
- [ ] No TypeScript errors
- [ ] Theme toggle works
- [ ] Responsive design verified

### **Practice App**
- [ ] All features functional
- [ ] Firebase connection working
- [ ] API keys configured
- [ ] No console errors

### **After Deployment**
- [ ] Marketing site loads at root URL
- [ ] Practice app loads at /app URL
- [ ] Both sites responsive
- [ ] No broken links or errors

## 🔄 Rollback Procedure

### **If Deployment Fails**
```bash
# Check Firebase hosting history
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION_ID TARGET_SITE_ID

# Or redeploy previous version
git checkout previous-commit
npm run deploy:marketing  # or deploy:app
```

## 📊 Monitoring

### **Check Deployment Status**
```bash
# List hosting channels
firebase hosting:channel:list

# View project console
open https://console.firebase.google.com/project/baseball-practice-generator
```

### **Performance Monitoring**
- Firebase Console → Performance
- Lighthouse scores
- Core Web Vitals

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev:marketing` | Start marketing dev server |
| `npm run build:marketing` | Build marketing site |
| `npm run deploy:marketing` | Deploy marketing site |
| `npm run deploy:app` | Deploy practice app |
| `./deploy-marketing.sh` | Direct marketing deployment |
| `./deploy-app.sh` | Direct app deployment |
| `npm run clean` | Clean build artifacts |

## 📚 Additional Documentation

- **[Technical Deployment Guide](DEPLOYMENT_TECHNICAL.md)**: Comprehensive technical documentation
- **[Main README](README.md)**: Project overview and setup
- **[Marketing Site README](marketing/README.md)**: Marketing site specific docs
- **[Practice App README](app/README.md)**: Practice app specific docs

## 🆘 Emergency Contacts

- **Firebase Console**: https://console.firebase.google.com/project/baseball-practice-generator
- **GitHub Repository**: https://github.com/jhousvawls/baseball.git
- **Technical Documentation**: See DEPLOYMENT_TECHNICAL.md for detailed troubleshooting

---

**Last Updated**: January 2025  
**Deployment Status**: ✅ Both sites live and functional
