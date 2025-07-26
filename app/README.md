# Coach's Dugout Practice App

The core practice planning application for youth baseball coaches. This is the main application that provides AI-powered drill suggestions, video search, and team collaboration features.

## 🏗️ Architecture

This is a vanilla JavaScript application using:
- **Firebase**: Authentication, Firestore database, hosting
- **YouTube API**: Video search and embedding
- **OpenAI API**: AI-powered drill suggestions
- **Responsive Design**: Mobile-first approach

## 📁 Structure

```
app/
├── public/                      # Static files and main application
│   ├── index.html              # Main application entry point
│   ├── css/                    # Stylesheets
│   │   ├── main.css           # Main application styles
│   │   ├── components.css     # Component-specific styles
│   │   └── print.css          # Print-specific styles
│   └── js/                     # JavaScript modules
│       ├── app.js             # Main application logic
│       ├── config/            # Configuration files
│       │   └── firebase.js    # Firebase configuration
│       ├── modules/           # Feature modules
│       │   ├── aiAssistant.js # AI drill suggestions
│       │   ├── confirmation.js # User confirmations
│       │   └── videoSearch.js # YouTube video search
│       └── utils/             # Utility functions
│           ├── constants.js   # Application constants
│           └── helpers.js     # Helper functions
└── src/                        # Development source files
    └── ... (mirrors public structure)
```

## 🚀 Features

### **AI Coach Assistant**
- Describe practice problems and get instant drill suggestions
- Age-appropriate recommendations
- Integration with video search

### **Video Search & Management**
- YouTube API integration for finding drill videos
- Curated, youth-appropriate content
- Video embedding and playlist management

### **Team Collaboration**
- Multi-coach editing capabilities
- Real-time practice plan updates
- Activity logging and change tracking

### **Practice Planning**
- Drag-and-drop practice builder
- Time management tools
- Equipment and setup tracking
- Weather-aware suggestions

## 🔧 Configuration

### **Firebase Setup**
The app uses shared Firebase configuration from `../shared/config/firebase.js`:

```javascript
// Firebase configuration is automatically loaded
// No additional setup required
```

### **API Keys**
Required environment variables (set in Firebase hosting):
- `YOUTUBE_API_KEY`: For video search functionality
- `OPENAI_API_KEY`: For AI assistant features

## 🌐 Deployment

### **Deploy Practice App Only**
```bash
# From project root
npm run deploy:app
# or
./deploy-app.sh
```

### **Local Development**
```bash
# Serve locally (from app directory)
cd app
python -m http.server 8000
# or
npx serve public
```

## 📱 URL Structure

When deployed as part of the monorepo:
- **Marketing Site**: `yoursite.com`
- **Practice App**: `yoursite.com/app`
- **Admin Panel**: `yoursite.com/app#admin`

## 🔐 Authentication

### **User Roles**
- **Coaches**: Can create and edit practice plans
- **Head Coach**: Full team management access
- **Super Admin**: System-wide administration

### **Access Control**
- Firebase Authentication for user management
- Firestore security rules for data protection
- Role-based feature access

## 🗄️ Database Structure

### **Firestore Collections**
```
teams/
├── {teamId}/
│   ├── coaches/           # Team coaching staff
│   ├── practices/         # Practice plans
│   ├── players/          # Team roster
│   └── settings/         # Team configuration

users/
├── {userId}/             # User profiles and preferences

videos/
├── {videoId}/            # Curated video database
```

## 🛠️ Development

### **Adding New Features**
1. Create module in `public/js/modules/`
2. Add styles to `public/css/components.css`
3. Import and initialize in `public/js/app.js`
4. Update documentation

### **Code Style**
- ES6+ JavaScript features
- Modular architecture
- Firebase best practices
- Mobile-first responsive design

## 🔍 Debugging

### **Common Issues**
- **Firebase connection**: Check console for authentication errors
- **Video loading**: Verify YouTube API key and quotas
- **AI features**: Confirm OpenAI API key and credits

### **Development Tools**
- Browser DevTools for debugging
- Firebase Console for data inspection
- Network tab for API call monitoring

## 📊 Performance

### **Optimization Features**
- Lazy loading for video content
- Efficient Firestore queries
- Cached API responses
- Optimized image assets

### **Monitoring**
- Firebase Performance Monitoring
- Error tracking via Firebase Crashlytics
- User analytics for feature usage

## 🔄 Updates

### **Deployment Process**
1. Test changes locally
2. Commit to version control
3. Run deployment script
4. Verify functionality in production

### **Database Migrations**
- Firestore security rules updates
- Data structure changes
- Feature flag management

## 📞 Support

### **Documentation**
- Main project README in repository root
- Firebase documentation for backend features
- YouTube API documentation for video features

### **Troubleshooting**
- Check Firebase Console for errors
- Review browser console for JavaScript issues
- Verify API key configuration and quotas

---

**Part of**: Coach's Dugout Monorepo  
**Technology**: Vanilla JavaScript + Firebase  
**Deployment**: Firebase Hosting with smart routing
