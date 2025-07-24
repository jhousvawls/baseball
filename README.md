# 6U Braves Baseball Practice Generator

A comprehensive, mobile-first web application for managing 6U baseball practice plans with a powerful Content Management System (CMS). Built with Firebase backend and optimized for coaches and administrators.

## 🏆 Features

### **Public Practice Viewer**
- **8 Progressive Practice Plans**: Complete curriculum from fundamentals to game situations
- **Interactive Navigation**: Numbered buttons (1-8) for easy practice selection
- **Video Integration**: Working YouTube links for drill demonstrations
- **Mobile Responsive**: Optimized for phones, tablets, and desktop
- **Atlanta Braves Branding**: Professional team colors and logo
- **Real-time Updates**: Changes from admin sync instantly

### **Multi-Coach Admin System**
- **Google Authentication**: Secure sign-in with Google accounts
- **Super Admin Controls**: Create and manage coach accounts
- **Coach Management Panel**: Add, remove, and manage up to 8 coaches
- **Activity Tracking**: See who made what changes and when
- **Real-time Collaboration**: All coaches can edit practices simultaneously
- **Mobile-First Design**: Touch-friendly editing optimized for phones
- **Complete Content Control**: Edit all practice sections, titles, descriptions, and videos
- **Time Management**: Editable durations with auto-calculating total time
- **Real-time Sync**: Changes appear immediately for all users

### **Smart Video Finder**
- **YouTube API Integration**: Automatically search for relevant baseball drill videos
- **Contextual Search**: Searches based on drill names for targeted results
- **Mobile-Optimized Interface**: Touch-friendly video selection on phones and tablets
- **Content Filtering**: Youth-appropriate content with safety filters
- **One-Click Selection**: Instantly add video URLs to practice plans
- **Preview Functionality**: Watch videos before adding them to practices
- **Intelligent Caching**: Faster searches with result caching
- **Quality Filtering**: Prioritizes instructional content from reputable channels

## 🚀 Quick Start

### **For Regular Users**
1. Open `practice-generator.html` in any web browser
2. Click numbered buttons (1-8) to view different practices
3. Click video links to watch drill demonstrations
4. Use on any device - mobile, tablet, or desktop

### **For Super Admin (First Time Setup)**
1. Scroll to bottom and click the red "Admin" button
2. Click "Sign in with Google" or use email/password: `admin@braves-practice.com` / `BravesAdmin2025!`
3. Go to "Coaches" tab to add your coaching staff
4. Enter each coach's Gmail address and click "Add Coach"
5. Coaches can now sign in with their Google accounts

### **For Coaches**
1. Scroll to bottom and click the red "Admin" button
2. Click "Sign in with Google" using your authorized Gmail account
3. Navigate between "Practices" and "Activity" tabs
4. Click "Edit" on any practice to modify content
5. Make changes and click "Save Changes"
6. View recent changes in the "Activity" tab

## 📋 Next Steps for You

To fully activate the Smart Video Finder and multi-coach system, complete these setup steps:

### **1. Update Firestore Security Rules**
Copy the rules from `firestore-security-rules.txt` and apply them in your Firebase Console:
1. Go to Firebase Console → Firestore Database → Rules
2. Replace the existing rules with the content from `firestore-security-rules.txt`
3. Click "Publish" to activate the new rules

### **2. Enable Google Authentication**
Set up Google sign-in for your coaches:
1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Google" provider
3. Enable the provider and add your domain to authorized domains
4. Save the configuration

### **3. Update Super Admin Email**
Change the super admin email to your Gmail address:
1. Open `public/index.html` in your code editor
2. Find the line: `const SUPER_ADMIN_EMAIL = 'admin@braves-practice.com';`
3. Replace with your Gmail address: `const SUPER_ADMIN_EMAIL = 'your-email@gmail.com';`
4. Save and redeploy the application

### **4. Add Your Coaches**
Use the coach management panel to authorize your coaching staff:
1. Sign in as super admin
2. Go to "Coaches" tab (only visible to super admin)
3. Enter each coach's Gmail address and click "Add Coach"
4. Coaches can now sign in with their Google accounts and edit practices

### **5. Test Smart Video Finder**
Verify the video search functionality:
1. Edit any practice plan
2. Click "Find Videos" next to any video URL field
3. Search results should appear with baseball drill videos
4. Select a video to automatically fill the URL field

### **🎯 You're Ready!**
Once these steps are complete, you'll have:
- ✅ Multi-coach collaboration with Google authentication
- ✅ Smart Video Finder for easy video discovery
- ✅ Real-time practice editing and activity tracking
- ✅ Mobile-optimized interface for coaching on the go

## 📱 Mobile-First CMS

The admin interface is specifically designed for mobile editing:

- **Large Touch Targets**: Easy to tap buttons and form fields
- **Full-Screen Modals**: Distraction-free editing experience
- **Swipe-Friendly Navigation**: Smooth scrolling and interaction
- **Auto-Save Functionality**: Frequent saves prevent data loss
- **Responsive Forms**: Stack vertically on mobile for easy input

## 🏗️ Technical Architecture

### **Frontend**
- **Single HTML File**: Complete application in one file for easy deployment
- **Vanilla JavaScript**: No frameworks - pure ES6+ modules
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Font Awesome**: Icons for enhanced UI
- **Responsive Design**: Mobile-first approach with breakpoints

### **Backend & Database**
- **Firebase Firestore**: NoSQL document database for practice data
- **Firebase Authentication**: Secure admin login system
- **Real-time Listeners**: Live updates across all connected clients
- **Anonymous Authentication**: Public users sign in anonymously
- **Batch Operations**: Efficient database writes

### **Data Structure**
```javascript
{
  id: 1,
  title: "Practice Title",
  warmup: {
    title: "Warmup Title",
    desc: "Description...",
    duration: 5
  },
  stations: [
    {
      name: "Station Name",
      desc: "Station description...",
      video: "https://youtube.com/..."
    }
    // 4 stations total
  ],
  finisher: {
    title: "Finisher Title", 
    desc: "Description...",
    duration: 8
  },
  wrapup: {
    title: "Wrapup Title",
    desc: "Description...", 
    duration: 2
  },
  homework: {
    title: "Homework Title",
    desc: "Description...",
    video: "https://youtube.com/..."
  }
}
```

## 🔧 Configuration

### **Firebase Setup**
The app requires Firebase configuration in the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### **Required Firebase Services**
1. **Firestore Database**: For storing practice data
2. **Authentication**: For admin login (Anonymous + Email/Password)

### **Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users
    match /practices/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎯 Key Functions & Components

### **Core Application Functions**

#### **Data Management**
- `loadPractices()`: Sets up real-time Firestore listener
- `seedDatabase()`: Creates initial 8 practice plans (runs once)
- `renderUI()`: Updates entire interface based on data changes
- `displayPracticePlan(practice)`: Renders individual practice content

#### **UI Rendering**
- `populatePracticeButtons()`: Creates numbered navigation buttons
- `displayPracticePlan()`: Generates practice content HTML
- `renderAdminDashboard()`: Creates admin practice list
- `renderPracticeEditor()`: Builds practice editing interface

#### **Admin System**
- `enterAdminMode()`: Switches to admin interface
- `exitAdminMode()`: Returns to public view
- `collectPracticeData()`: Gathers form data for saving
- `calculateTotalTime()`: Auto-calculates practice duration

### **State Management**
- `practiceCache[]`: Local array of practice data from Firestore
- `activeButton`: Currently selected practice button
- `isAdminMode`: Boolean tracking admin state
- `currentEditingPractice`: Practice being edited

### **Authentication Flow**
1. **Public Users**: Anonymous sign-in for database access
2. **Admin Users**: Email/password authentication
3. **Default Admin**: Auto-created on first login attempt
4. **Session Management**: Maintains login state across browser sessions

## 🔄 Data Flow

### **Application Startup**
1. Firebase initializes with configuration
2. Anonymous authentication begins
3. Firestore listener established
4. Database seeded if empty (first run only)
5. UI renders with practice data

### **Admin Editing Flow**
1. Admin clicks "Admin" button
2. Login modal appears
3. Firebase authenticates credentials
4. Admin dashboard loads with practice list
5. Admin clicks "Edit" on desired practice
6. Practice editor modal opens with current data
7. Admin makes changes and clicks "Save"
8. Data updates in Firestore
9. Real-time listeners update all connected clients

### **Real-time Updates**
- Firestore `onSnapshot()` listener detects changes
- `practiceCache` updates with new data
- `renderUI()` re-renders interface
- All users see changes immediately

## 🎨 Styling & Branding

### **Atlanta Braves Theme**
- **Navy Blue**: `#13274F` (primary text, headers)
- **Red**: `#CE1141` (accents, buttons, active states)
- **Logo**: High-quality transparent PNG
- **Typography**: Inter font family for modern, clean look

### **CSS Classes**
- `.bg-braves-navy`: Navy background
- `.text-braves-navy`: Navy text
- `.bg-braves-red`: Red background
- `.text-braves-red`: Red text
- `.practice-btn`: Animated practice selector buttons
- `.video-link`: Styled video link buttons
- `.animate-fade-in`: Smooth content transitions

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: Default styles (< 640px)
- **Tablet**: `sm:` prefix (≥ 640px)
- **Desktop**: `md:` prefix (≥ 768px)

### **Mobile Optimizations**
- Touch-friendly button sizes (minimum 44px)
- Readable font sizes on small screens
- Optimized form layouts for mobile keyboards
- Swipe-friendly navigation
- Full-screen modals for editing

## 🔒 Security Considerations

### **Authentication**
- Admin passwords should be strong and unique
- Firebase handles secure password storage and validation
- Session tokens managed automatically by Firebase

### **Database Access**
- Public read access for practice viewing
- Write access restricted to authenticated users
- Firestore security rules enforce permissions

### **Content Validation**
- YouTube URL validation in admin forms
- Input sanitization prevents XSS attacks
- Form validation ensures data integrity

## 🚀 Deployment

### **Simple Deployment**
1. Upload `practice-generator.html` to any web server
2. Configure Firebase project and update config
3. Set up Firestore security rules
4. Enable Authentication methods
5. Access via web browser

### **Hosting Options**
- **Firebase Hosting**: Integrated with Firebase services
- **GitHub Pages**: Free static hosting
- **Netlify**: Easy deployment with form handling
- **Any Web Server**: Works with basic HTTP hosting

## 👥 Multi-Coach Admin System

### **System Overview**
The multi-coach admin system allows you (as the super admin) to create and manage accounts for your coaching staff, enabling collaborative practice plan editing with full activity tracking.

### **Key Features**
- **Google Authentication**: Coaches sign in with their existing Google accounts
- **Super Admin Controls**: Only you can add/remove coaches and manage permissions
- **Real-time Collaboration**: Multiple coaches can edit practices simultaneously
- **Activity Tracking**: See exactly who made what changes and when
- **Mobile-Optimized**: Perfect for coaches editing on their phones

### **Setup Instructions**

#### **1. Initial Super Admin Setup**
1. Update the `SUPER_ADMIN_EMAIL` constant in `public/index.html` to your Gmail address
2. Deploy the updated application
3. Sign in using Google authentication or the fallback email/password

#### **2. Firebase Configuration**
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Google" sign-in provider
3. Add your domain to authorized domains
4. Update Firestore security rules using `firestore-security-rules.txt`

#### **3. Adding Coaches**
1. Sign in as super admin
2. Go to "Coaches" tab (only visible to super admin)
3. Enter coach's Gmail address and click "Add Coach"
4. Coach can now sign in with their Google account

### **Coach Management**
- **Add Coach**: Enter Gmail address to authorize new coaches
- **Deactivate/Activate**: Temporarily disable coach access without removing them
- **Remove Coach**: Permanently remove coach access
- **View Activity**: See when coaches were added and their last login

### **Activity Tracking**
- **Real-time Logging**: Every practice edit is automatically logged
- **Coach Attribution**: Shows which coach made each change
- **Timestamp Tracking**: "Time ago" formatting for easy reading
- **Change History**: View up to 20 recent practice modifications

### **Database Collections**

#### **authorized_coaches**
```javascript
{
  email: "coach@gmail.com",
  displayName: "Coach Name",
  addedBy: "admin@braves-practice.com",
  addedAt: timestamp,
  isActive: true,
  lastLogin: timestamp
}
```

#### **practice_changes**
```javascript
{
  practiceId: 3,
  practiceTitle: "Making Connections",
  changedBy: "coach@gmail.com",
  changedByName: "Coach Name",
  changeType: "edited",
  changedAt: timestamp
}
```

### **Security Model**
- **Super Admin**: Full access to all features including coach management
- **Regular Coaches**: Can edit practices and view activity, cannot manage other coaches
- **Public Users**: Read-only access to practice plans
- **Firestore Rules**: Enforce proper access control at the database level

### **Collaboration Features**
- **Real-time Sync**: Changes appear instantly for all users
- **Conflict Resolution**: Firebase handles concurrent edits automatically
- **Mobile-First**: Optimized for coaches editing on phones during practice
- **Offline Support**: Basic offline functionality through Firebase caching

### **Troubleshooting Multi-Coach Issues**

#### **Coach Can't Sign In**
- Verify coach email is added to authorized list
- Check that coach is using the correct Gmail account
- Ensure coach status is "Active" in coach management panel

#### **Google Sign-In Not Working**
- Verify Google authentication is enabled in Firebase Console
- Check that domain is added to authorized domains
- Ensure Firebase configuration is correct

#### **Activity Not Showing**
- Check that practice changes are being logged (console.log messages)
- Verify Firestore security rules allow reading practice_changes collection
- Ensure authenticated user has proper permissions

## 🎥 Smart Video Finder

### **Overview**
The Smart Video Finder is an intelligent video search system that helps coaches quickly find and add high-quality, youth-appropriate baseball instructional videos to their practice plans. This feature integrates seamlessly with the practice editor and is optimized for mobile use.

### **How It Works**

#### **For Coaches Using the Feature**
1. **Access**: Open any practice for editing in the admin dashboard
2. **Search**: Click the blue "Find Videos" button next to any video URL field
3. **Results**: View 5 relevant, filtered video results with thumbnails
4. **Preview**: Click "Preview" to watch a video before selecting it
5. **Select**: Click "Use This Video" to automatically fill the URL field
6. **Save**: Save the practice as usual with the new video integrated

#### **Behind the Scenes**
- **Contextual Search**: Uses the drill name (e.g., "Alligator Chomps") to search YouTube
- **Smart Filtering**: Automatically filters for youth baseball content
- **Quality Control**: Prioritizes instructional videos from reputable channels
- **Safety First**: Excludes inappropriate content using multiple filter layers

### **Mobile Optimization**

#### **Touch-Friendly Design**
- **Large Touch Targets**: All buttons are minimum 44px for easy tapping
- **Responsive Layout**: Video cards stack vertically on mobile devices
- **Swipe Navigation**: Smooth scrolling through search results
- **One-Handed Use**: Interface designed for single-hand operation

#### **Performance Features**
- **Fast Loading**: Optimized thumbnails load quickly on mobile networks
- **Result Caching**: Repeated searches for the same drill are instant
- **Minimal Data Usage**: Efficient API calls reduce mobile data consumption
- **Offline Fallback**: Manual URL entry available if search fails

### **Content Filtering & Safety**

#### **Youth-Appropriate Content**
- **Age Filtering**: Focuses on content suitable for 6U players
- **Duration Limits**: Prefers videos under 4 minutes for attention spans
- **Safe Search**: YouTube's strict safe search enabled
- **Content Exclusions**: Automatically excludes injury, accident, or inappropriate content

#### **Quality Prioritization**
- **Baseball Focus**: Prioritizes videos with "drill", "training", "youth baseball"
- **Channel Reputation**: Favors instructional channels and coaching content
- **Relevance Scoring**: Orders results by relevance to the specific drill
- **Recent Content**: Balances relevance with video quality and upload date

### **Technical Implementation**

#### **YouTube Data API Integration**
```javascript
// API Configuration
const YOUTUBE_API_KEY = 'your-api-key';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

// Search Parameters
{
  part: 'snippet',
  q: 'drill-name youth baseball drill kids training',
  type: 'video',
  videoDuration: 'short',
  safeSearch: 'strict',
  maxResults: 5,
  order: 'relevance'
}
```

#### **Content Filtering Algorithm**
```javascript
function filterVideoResults(videos) {
  return videos.filter(video => {
    const title = video.snippet.title.toLowerCase();
    const description = video.snippet.description.toLowerCase();
    
    // Include baseball-related terms
    const baseballTerms = ['baseball', 'drill', 'youth', 'kids', 'training'];
    const hasBaseballContent = baseballTerms.some(term => 
      title.includes(term) || description.includes(term)
    );
    
    // Exclude inappropriate content
    const excludeTerms = ['injury', 'accident', 'fail', 'blooper'];
    const hasInappropriateContent = excludeTerms.some(term => 
      title.includes(term) || description.includes(term)
    );
    
    return hasBaseballContent && !hasInappropriateContent;
  });
}
```

### **User Interface Components**

#### **Video Search Modal**
- **Header**: Shows the drill name being searched
- **Loading State**: Spinner with "Searching for videos..." message
- **Results Grid**: Mobile-optimized video cards with thumbnails
- **Error Handling**: Retry button and manual entry fallback
- **Close Options**: X button, outside click, or manual entry button

#### **Video Result Cards**
```html
<div class="video-result-card">
  <img src="thumbnail" class="w-20 h-15 rounded-lg">
  <div class="video-info">
    <h4>Video Title</h4>
    <p>Channel Name</p>
    <p>Published Date</p>
    <button class="use-video-btn">Use This Video</button>
    <button class="preview-video-btn">Preview</button>
  </div>
</div>
```

### **Setup & Configuration**

#### **YouTube Data API Setup**
1. **Google Cloud Console**: Create a new project or use existing
2. **Enable API**: Enable YouTube Data API v3
3. **Create Credentials**: Generate an API key
4. **Restrict Key**: Limit to your domain for security
5. **Update Code**: Add API key to the `YOUTUBE_API_KEY` constant

#### **API Key Security**
- **Domain Restrictions**: Limit API key usage to your domain
- **Quota Management**: Monitor API usage to stay within limits
- **Rate Limiting**: Built-in request throttling prevents quota exhaustion
- **Error Handling**: Graceful fallbacks when API limits are reached

### **Usage Analytics & Monitoring**

#### **Performance Metrics**
- **Search Success Rate**: Percentage of searches returning useful results
- **Cache Hit Rate**: How often cached results are used vs. new API calls
- **User Engagement**: Which videos are selected most often
- **Error Tracking**: API failures and user-reported issues

#### **Optimization Opportunities**
- **Popular Drills**: Pre-cache results for commonly searched drills
- **Channel Whitelist**: Maintain list of trusted instructional channels
- **Seasonal Content**: Adjust search terms based on practice focus
- **User Feedback**: Allow coaches to rate video quality

### **Troubleshooting**

#### **Common Issues**

**No Search Results**
- Check internet connection
- Verify API key is valid and has quota remaining
- Try alternative search terms or manual URL entry

**Poor Video Quality**
- Results are filtered for appropriateness, not production quality
- Use preview function to evaluate before selecting
- Manual URL entry allows for specific video selection

**API Quota Exceeded**
- Implement result caching to reduce API calls
- Consider upgrading to paid API tier for higher limits
- Add fallback to manual URL entry

#### **Debug Information**
- Open browser developer tools (F12)
- Check console for API response details
- Monitor network tab for failed requests
- Review error messages in the search modal

### **Future Enhancements**

#### **Planned Features**
- **Favorite Videos**: Save commonly used videos for quick access
- **Batch Video Updates**: Update multiple practices with new videos
- **Video Playlists**: Create themed collections of instructional videos
- **Offline Mode**: Download videos for offline practice planning

#### **Advanced Filtering**
- **Skill Level**: Filter by beginner, intermediate, advanced content
- **Video Length**: More granular duration controls
- **Equipment Needed**: Filter by required equipment (tees, cones, etc.)
- **Coach Ratings**: Community-driven video quality ratings

## 🔧 Development & Customization

### **Adding New Practice Sections**
1. Update data structure in `seedDatabase()`
2. Modify `renderPracticeEditor()` to include new fields
3. Update `collectPracticeData()` to gather new data
4. Adjust `displayPracticePlan()` to show new sections

### **Customizing Branding**
1. Update CSS custom properties for colors
2. Replace logo URL in header
3. Modify team name in title and footer
4. Adjust color classes throughout HTML

### **Adding Features**
- **Practice Templates**: Pre-made drill templates
- **Print Functionality**: CSS print styles
- **Export Options**: PDF generation
- **User Roles**: Different admin permission levels
- **Practice Scheduling**: Calendar integration

## 🐛 Troubleshooting

### **Common Issues**

#### **Firebase Connection Errors**
- Verify Firebase configuration is correct
- Check that Firestore and Authentication are enabled
- Ensure security rules allow appropriate access

#### **Admin Login Problems**
- Confirm email/password are correct
- Check that Authentication is enabled in Firebase
- Verify Anonymous sign-in is enabled

#### **Video Links Not Working**
- Ensure YouTube URLs are complete and valid
- Check that videos are publicly accessible
- Verify URLs start with `https://`

#### **Mobile Display Issues**
- Clear browser cache and reload
- Check viewport meta tag is present
- Verify Tailwind CSS is loading properly

### **Debug Mode**
Open browser developer tools (F12) and check console for error messages. The app logs important events and errors for troubleshooting.

## 📈 Performance Optimization

### **Loading Speed**
- Single HTML file reduces HTTP requests
- CDN resources (Tailwind, Font Awesome) cached globally
- Firebase SDK loaded from CDN
- Minimal JavaScript bundle size

### **Database Efficiency**
- Real-time listeners only for necessary data
- Batch writes for initial data seeding
- Local caching reduces database reads
- Optimized query structure

### **Mobile Performance**
- Touch events optimized for mobile
- Minimal DOM manipulation
- Efficient CSS animations
- Responsive images and assets

## 🤝 Contributing

### **Code Style**
- Use ES6+ JavaScript features
- Follow consistent indentation (2 spaces)
- Comment complex functions
- Use descriptive variable names

### **Testing**
- Test on multiple devices and browsers
- Verify admin functionality works correctly
- Check video links are accessible
- Validate responsive design

## 📄 License

This project is designed for youth baseball coaching and educational purposes. Feel free to adapt and customize for your team's needs.

## 🏆 Credits

Built for the 6U Atlanta Braves youth baseball team to make coaching fun and effective. Go Braves! ⚾

---

**Version**: 2.0  
**Last Updated**: January 2025  
**Compatibility**: Modern browsers with ES6+ support  
**Dependencies**: Firebase SDK, Tailwind CSS, Font Awesome
