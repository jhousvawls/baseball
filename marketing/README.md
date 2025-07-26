# Coach's Dugout Marketing Site

A modern, professional React + TypeScript marketing website with light/dark mode functionality for the Coach's Dugout baseball practice planning application.

## 🌟 Features

### **Modern React Architecture**
- **Vite + React 18 + TypeScript**: Lightning-fast development with type safety
- **Component-based Design**: Reusable, maintainable components
- **Professional File Structure**: Clean separation of concerns
- **Hot Module Replacement**: Instant updates during development

### **Light/Dark Mode Theme System**
- **CSS Custom Properties**: Seamless theme switching using CSS variables
- **Theme Persistence**: User preference saved to localStorage
- **System Detection**: Automatically detects OS theme preference
- **Smooth Transitions**: Beautiful animations when switching themes
- **Accessible**: Proper ARIA labels and keyboard navigation

### **Responsive Design**
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and intuitive interactions
- **Professional Styling**: Clean, modern design with Braves team colors
- **Performance Optimized**: Fast loading and smooth animations

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+ (recommended: Node.js 18+)
- npm or yarn package manager

### **Installation**
```bash
# Clone or navigate to the project
cd marketing-site-react

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
marketing-site-react/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header with theme toggle
│   │   ├── Hero.tsx         # Main hero section
│   │   ├── Features.tsx     # Feature showcase grid
│   │   └── ThemeToggle.tsx  # Theme switching component
│   ├── hooks/               # Custom React hooks
│   │   └── useTheme.ts      # Theme management hook
│   ├── lib/                 # Utilities and configurations
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── firebase.ts      # Firebase configuration (ready for CMS)
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with theme system
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 🎨 Theme System

### **CSS Custom Properties**
The theme system uses CSS custom properties for seamless switching:

```css
:root {
  /* Light theme */
  --bg-primary: #ffffff;
  --text-primary: #1e293b;
  --accent-primary: #CE1141;
  --accent-secondary: #13274F;
}

[data-theme="dark"] {
  /* Dark theme */
  --bg-primary: #0f172a;
  --text-primary: #f1f5f9;
  --accent-primary: #f87171;
  --accent-secondary: #60a5fa;
}
```

### **Theme Hook Usage**
```typescript
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
};
```

### **Theme Colors**

#### **Light Mode**
- **Background**: Clean whites and light grays
- **Text**: Dark slate for readability
- **Accents**: Braves red (#CE1141) and navy (#13274F)
- **Shadows**: Subtle gray shadows

#### **Dark Mode**
- **Background**: Dark slate and navy tones
- **Text**: Light colors for contrast
- **Accents**: Softer red (#f87171) and blue (#60a5fa)
- **Shadows**: Enhanced dark shadows

## 🧩 Components

### **Header Component**
```typescript
<Header
  title="Coach's Dugout"
  navFeatures="Features"
  navPricing="Pricing"
  navLogin="Login"
  ctaText="Get Started"
/>
```

### **Hero Component**
```typescript
<Hero
  headline="Stop Guessing. Start Coaching."
  subtitle="The all-in-one practice planner..."
  ctaPrimary="Start Your Free Trial"
  ctaSecondary="Learn More"
  image="https://example.com/hero-image.jpg"
/>
```

### **Features Component**
```typescript
<Features
  title="Everything You Need"
  subtitle="From AI assistance to collaboration"
  feature1={{ title: "AI Assistant", description: "..." }}
  feature2={{ title: "Collaboration", description: "..." }}
  feature3={{ title: "Video Finder", description: "..." }}
/>
```

### **Theme Toggle Component**
```typescript
<ThemeToggle />
```

## 🔧 Customization

### **Colors**
Update the CSS custom properties in `src/index.css`:

```css
:root {
  --accent-primary: #your-color;
  --accent-secondary: #your-color;
}
```

### **Content**
Modify the `defaultContent` object in `src/App.tsx`:

```typescript
const defaultContent: MarketingContent = {
  header: {
    title: "Your App Name",
    // ... other content
  },
  // ... other sections
};
```

### **Styling**
- **Global styles**: Edit `src/index.css`
- **Component styles**: Use CSS classes defined in the global stylesheet
- **Responsive breakpoints**: Modify media queries in `src/index.css`

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Firebase Hosting**
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init hosting

# Deploy
firebase deploy
```

### **Deploy to Netlify**
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
# Or connect your Git repository to Netlify for automatic deployments
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🔮 Future Enhancements

### **Content Management System (CMS)**
- **Firebase Integration**: Connect to Firestore for dynamic content
- **Admin Panel**: Build editing interface for content updates
- **Image Management**: Add Firebase Storage for image uploads
- **Real-time Updates**: Live content updates across all visitors

### **Additional Features**
- **Blog Section**: Add a blog with markdown support
- **Contact Forms**: Integrate with form handling services
- **Analytics**: Add Google Analytics or similar tracking
- **SEO Optimization**: Add meta tags and structured data
- **Performance**: Implement code splitting and lazy loading

### **Advanced Theming**
- **Multiple Themes**: Add more color schemes
- **Custom Themes**: Allow users to create custom themes
- **Theme Presets**: Predefined themes for different use cases

## 🛠️ Development

### **Code Style**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting for consistency
- **Prettier**: Code formatting (recommended)
- **Component naming**: PascalCase for components, camelCase for functions

### **Best Practices**
- **Component composition**: Prefer composition over inheritance
- **Props interface**: Define clear TypeScript interfaces for all props
- **Custom hooks**: Extract reusable logic into custom hooks
- **CSS organization**: Use CSS custom properties for theming

### **Testing (Future)**
```bash
# Add testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

## 📱 Mobile Optimization

### **Responsive Design**
- **Breakpoints**: 640px (sm), 768px (md), 1024px (lg)
- **Touch targets**: Minimum 44px for touch-friendly interaction
- **Typography**: Responsive font sizes using clamp()
- **Images**: Responsive images with proper aspect ratios

### **Performance**
- **Lazy loading**: Images load as needed
- **Code splitting**: Components loaded on demand
- **Optimized assets**: Compressed images and minified code
- **Fast loading**: Optimized for mobile networks

## 🔒 Security

### **Best Practices**
- **No sensitive data**: All configuration is client-side safe
- **HTTPS only**: Secure connections required
- **Content Security Policy**: Implement CSP headers
- **Input validation**: Sanitize all user inputs (when CMS is added)

## 📊 Performance

### **Optimization Features**
- **Vite bundling**: Fast builds and optimized output
- **Tree shaking**: Unused code elimination
- **CSS optimization**: Minified and optimized styles
- **Image optimization**: Responsive images with proper formats

### **Monitoring**
- **Core Web Vitals**: Monitor loading performance
- **Bundle analysis**: Track bundle size and dependencies
- **Runtime performance**: Monitor component render times

## 🤝 Contributing

### **Development Workflow**
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow the coding standards
4. **Test thoroughly**: Ensure all functionality works
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### **Code Standards**
- **TypeScript**: Use strict typing
- **Components**: Keep components small and focused
- **Hooks**: Extract reusable logic
- **CSS**: Use the established design system

## 📞 Support

### **Getting Help**
- **Documentation**: Check this README and code comments
- **Issues**: Report bugs and request features via GitHub issues
- **Community**: Join discussions in the project community

### **Common Issues**

#### **Development Server Won't Start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### **Build Errors**
```bash
# Check TypeScript errors
npm run build
# Fix any type errors reported
```

#### **Theme Not Switching**
- Check browser console for JavaScript errors
- Ensure localStorage is available
- Verify CSS custom properties are supported

## 📄 License

This project is designed for the Coach's Dugout baseball practice planning application. Feel free to adapt and customize for your needs.

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Built with**: React 18, TypeScript, Vite  
**Compatibility**: Modern browsers with ES6+ support
