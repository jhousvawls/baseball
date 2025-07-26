# Coach's Dugout - Baseball Practice Planning Platform

A comprehensive monorepo containing both the marketing website and practice planning application for youth baseball coaches.

## 🏗️ Project Structure

```
baseball/
├── marketing/                   # React marketing website
│   ├── src/                    # React components and hooks
│   ├── package.json           # Marketing site dependencies
│   └── README.md              # Marketing site documentation
│
├── app/                        # Practice planning application
│   ├── public/                # Main application files
│   ├── src/                   # Development source files
│   └── README.md              # App documentation
│
├── shared/                     # Shared resources
│   └── config/                # Shared configurations
│       └── firebase.js        # Firebase configuration
│
├── deploy-marketing.sh         # Marketing site deployment
├── deploy-app.sh              # Practice app deployment
├── firebase.json              # Firebase hosting configuration
└── package.json               # Root workspace configuration
```

## 🌟 Features

### **Marketing Website** (`/marketing`)
- **Modern React + TypeScript**: Professional marketing site
- **Light/Dark Mode**: Seamless theme switching
- **Responsive Design**: Mobile-first approach
- **Professional Styling**: Clean, modern design with team branding

### **Practice Planning App** (`/app`)
- **AI Coach Assistant**: Get instant drill suggestions
- **Video Search**: Find youth-appropriate drill videos
- **Team Collaboration**: Multi-coach editing capabilities
- **Practice Builder**: Drag-and-drop practice planning

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+ (recommended: Node.js 18+)
- Firebase CLI (`npm install -g firebase-tools`)
- Git for version control

### **Installation**
```bash
# Clone the repository
git clone https://github.com/jhousvawls/baseball.git
cd baseball

# Install root dependencies
npm install

# Install marketing site dependencies
npm run install:marketing
```

### **Development**
```bash
# Start marketing site development server
npm run dev:marketing

# Serve practice app locally (from app directory)
cd app && python -m http.server 8000
```

## 🌐 Deployment

### **Live URLs**
- **🏠 Marketing Site**: https://baseball-practice-generator.web.app
- **⚾ Practice App**: https://baseball-practice-generator.web.app/app

### **Deployment Status**
- ✅ **Marketing Site**: Deployed and live (React + TypeScript with light/dark mode)
- ✅ **Practice App**: Deployed and live (Full coaching application)
- ✅ **Firebase Hosting**: Configured with smart routing
- ✅ **Monorepo Structure**: Complete and functional

### **Deploy Both Sites (Unified - Recommended)**
```bash
# Deploy both marketing site and practice app together
npm run deploy

# Or use the unified script directly
./deploy-unified.sh
```

### **Deploy Marketing Site Only**
```bash
# Build and deploy marketing site
npm run deploy:marketing

# Or use the script directly
./deploy-marketing.sh
```

### **Deploy Practice App Only**
```bash
# Deploy practice app
npm run deploy:app

# Or use the script directly
./deploy-app.sh
```

### **Initial Setup (One-time)**
```bash
# Fix npm permissions (if needed)
sudo chown -R $(id -u):$(id -g) ~/.npm

# Install marketing dependencies
npm run install:marketing

# Verify Firebase CLI is installed
firebase --version
```

## 📦 Available Scripts

### **Root Level Commands**
```bash
npm run dev:marketing        # Start marketing site dev server
npm run build:marketing      # Build marketing site for production
npm run deploy:marketing     # Deploy marketing site
npm run deploy:app          # Deploy practice app
npm run build:all           # Build all projects
npm run install:marketing   # Install marketing dependencies
npm run clean               # Clean build artifacts
```

## 🔧 Configuration

### **Firebase Setup**
The project uses a single Firebase project with smart routing:

```json
{
  "hosting": {
    "public": "marketing/dist",
    "rewrites": [
      { "source": "/app/**", "destination": "/app/index.html" },
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

### **Environment Variables**
Required for full functionality:
- `YOUTUBE_API_KEY`: For video search in practice app
- `OPENAI_API_KEY`: For AI assistant features

## 🏛️ Architecture

### **Monorepo Benefits**
- **Shared Firebase Project**: Cost-effective hosting
- **Unified Deployment**: Single domain with smart routing
- **Shared Resources**: Common configuration and assets
- **Version Control**: Single repository for all code

### **Technology Stack**

#### **Marketing Site**
- React 18 + TypeScript
- Vite for fast development
- CSS Custom Properties for theming
- Firebase Hosting

#### **Practice App**
- Vanilla JavaScript (ES6+)
- Firebase (Auth, Firestore, Hosting)
- YouTube API integration
- OpenAI API integration

## 🔐 Security

### **Authentication**
- Firebase Authentication for user management
- Role-based access control (Coach, Head Coach, Super Admin)
- Firestore security rules for data protection

### **API Security**
- API keys managed through Firebase environment
- CORS configuration for external APIs
- Input validation and sanitization

## 📱 Mobile Support

### **Responsive Design**
- Mobile-first CSS approach
- Touch-friendly interfaces
- Optimized for tablets and phones
- Progressive Web App capabilities

## 🛠️ Development

### **Code Organization**
- **Marketing**: Component-based React architecture
- **Practice App**: Modular JavaScript with clear separation
- **Shared**: Common configurations and utilities

### **Best Practices**
- TypeScript for type safety (marketing site)
- ES6+ features throughout
- Consistent code formatting
- Comprehensive documentation

## 📊 Performance

### **Optimization**
- **Marketing Site**: Vite bundling and tree shaking
- **Practice App**: Lazy loading and efficient queries
- **Hosting**: Firebase CDN for global distribution
- **Caching**: Optimized cache strategies

## 🔄 Version Control

### **Git Workflow**
```bash
# Feature development
git checkout -b feature/new-feature
git commit -m "Add new feature"
git push origin feature/new-feature

# Deployment
git checkout main
git merge feature/new-feature
npm run deploy:marketing  # or deploy:app
```

### **Branch Strategy**
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `hotfix/*`: Emergency fixes

## 📈 Analytics & Monitoring

### **Firebase Analytics**
- User engagement tracking
- Feature usage analytics
- Performance monitoring
- Error tracking and reporting

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Code Standards**
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure mobile compatibility

## 🔧 Troubleshooting

### **Common Issues**

#### **npm Permission Errors**
```bash
# Fix npm cache permissions
sudo chown -R $(id -u):$(id -g) ~/.npm

# Clear npm cache if needed
npm cache clean --force
```

#### **Marketing Site Build Errors**
```bash
# Reinstall dependencies
cd marketing
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Check for TypeScript errors
npm run build
```

#### **Firebase Deployment Issues**
```bash
# Login to Firebase
firebase login

# Check project configuration
firebase projects:list

# Verify hosting configuration
firebase hosting:channel:list
```

#### **Development Server Won't Start**
```bash
# Marketing site
cd marketing
npm install
npm run dev

# Practice app (serve locally)
cd app
python -m http.server 8000
# or
npx serve public
```

### **Configuration Verification**
```bash
# Check Firebase project
firebase use --add

# Verify hosting targets
firebase target:apply hosting marketing baseball-practice-generator

# Test deployment
firebase deploy --only hosting --dry-run
```

## 📞 Support

### **Documentation**
- [Marketing Site README](marketing/README.md)
- [Practice App README](app/README.md)
- [Firebase Documentation](https://firebase.google.com/docs)

### **Issues**
- Report bugs via GitHub Issues
- Feature requests welcome
- Include reproduction steps

## 🎯 Roadmap

### **Upcoming Features**
- **CMS Integration**: Dynamic content management
- **Advanced Analytics**: Detailed usage insights
- **Mobile App**: Native iOS/Android applications
- **Team Management**: Enhanced collaboration tools

### **Technical Improvements**
- **Testing Suite**: Comprehensive test coverage
- **CI/CD Pipeline**: Automated testing and deployment
- **Performance Optimization**: Further speed improvements
- **Accessibility**: Enhanced a11y compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- Firebase for hosting and backend services
- React community for excellent tooling
- Youth baseball coaches for feature inspiration
- Open source contributors

---

**Version**: 2.0.0  
**Last Updated**: January 2025  
**Maintainer**: Coach's Dugout Team  
**Repository**: https://github.com/jhousvawls/baseball.git
