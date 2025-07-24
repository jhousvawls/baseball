# 🎨 Baseball Practice Generator - Tailwind Style Guide

A comprehensive design system and component library for the 6U Baseball Practice Generator application.

## 📋 Table of Contents

1. [Design Tokens](#design-tokens)
2. [Button System](#button-system)
3. [Card Components](#card-components)
4. [Practice Blocks](#practice-blocks)
5. [Navigation](#navigation)
6. [Forms](#forms)
7. [Modals](#modals)
8. [States & Feedback](#states--feedback)
9. [Responsive Guidelines](#responsive-guidelines)
10. [Usage Examples](#usage-examples)

---

## 🎯 Design Tokens

### **Brand Colors**
```css
/* Primary Brand Colors */
--braves-navy: #13274F    /* Primary text, headers */
--braves-red: #CE1141     /* Primary actions, accents */
--braves-red-hover: #b10e37  /* Hover states */
--braves-red-light: rgba(206, 17, 65, 0.1)  /* Focus rings */
```

### **Tailwind Extensions**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'braves-navy': '#13274F',
        'braves-red': '#CE1141',
        'braves-red-hover': '#b10e37',
      }
    }
  }
}
```

### **Typography Scale**
- **Font Family**: Inter (Google Fonts)
- **Sizes**: text-xs (12px) → text-4xl (36px)
- **Weights**: font-normal (400), font-medium (500), font-semibold (600), font-bold (700)

### **Spacing Scale**
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px) 
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### **Border Radius**
- **sm**: 0.25rem (4px)
- **md**: 0.5rem (8px)
- **lg**: 0.75rem (12px)
- **xl**: 1rem (16px)

---

## 🔘 Button System

### **Primary Button**
```html
<button class="btn-primary">
  <i class="fas fa-save mr-2"></i>Save Changes
</button>
```
**Classes**: `bg-braves-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-braves-red-hover transition-all focus:ring-2 focus:ring-braves-red-light focus:outline-none`

### **Secondary Button**
```html
<button class="btn-secondary">Cancel</button>
```
**Classes**: `bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none`

### **Ghost Button**
```html
<button class="btn-ghost">
  <i class="fas fa-times mr-2"></i>Close
</button>
```
**Classes**: `text-gray-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all focus:ring-2 focus:ring-gray-300 focus:outline-none`

### **Danger Button**
```html
<button class="btn-danger">Delete</button>
```
**Classes**: `bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-300 focus:outline-none`

### **Button Sizes**
- **Small**: `btn-sm` → `px-3 py-1.5 text-sm`
- **Medium**: `btn-md` → `px-4 py-2 text-base` (default)
- **Large**: `btn-lg` → `px-6 py-3 text-lg`

### **Icon Buttons**
```html
<button class="btn-icon">
  <i class="fas fa-cog"></i>
</button>
```
**Classes**: `w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center focus:ring-2 focus:ring-gray-300 focus:outline-none`

---

## 🃏 Card Components

### **Base Card**
```html
<div class="card-base">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-content">
    <!-- Content -->
  </div>
</div>
```
**Classes**: 
- `card-base`: `bg-white rounded-xl shadow-md border border-gray-200`
- `card-header`: `p-4 border-b border-gray-200`
- `card-content`: `p-4`

### **Practice Card**
```html
<div class="card-practice">
  <div class="practice-header">
    <h3 class="practice-title">Practice 1: Fundamentals</h3>
    <span class="practice-duration">45 minutes</span>
  </div>
  <div class="practice-content">
    <!-- Practice sections -->
  </div>
</div>
```
**Classes**:
- `card-practice`: `bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-500`
- `practice-header`: `p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl`
- `practice-title`: `text-xl font-bold text-braves-navy`
- `practice-duration`: `text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full`

### **Admin Card**
```html
<div class="card-admin">
  <div class="admin-card-header">
    <h4>Admin Section</h4>
    <button class="btn-ghost btn-sm">Edit</button>
  </div>
  <div class="admin-card-content">
    <!-- Content -->
  </div>
</div>
```
**Classes**:
- `card-admin`: `bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow`
- `admin-card-header`: `flex items-center justify-between mb-4`

### **Interactive Card**
```html
<div class="card-interactive">
  <!-- Content -->
</div>
```
**Classes**: `bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-braves-red transition-all cursor-pointer`

---

## 🏗️ Practice Blocks

### **Practice Section**
```html
<div class="practice-section">
  <div class="section-header">
    <i class="fas fa-running section-icon"></i>
    <h3 class="section-title">Warmup</h3>
    <span class="section-duration">5 min</span>
  </div>
  <div class="section-content">
    <p class="section-description">Dynamic stretching and light jogging</p>
  </div>
</div>
```
**Classes**:
- `practice-section`: `mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200`
- `section-header`: `flex items-center gap-3 mb-3`
- `section-icon`: `text-braves-red text-lg`
- `section-title`: `text-lg font-semibold text-braves-navy flex-1`
- `section-duration`: `text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded`
- `section-content`: `text-gray-700 leading-relaxed`

### **Station Block**
```html
<div class="station-block">
  <div class="station-header">
    <h4 class="station-title">Station 1: Hitting</h4>
    <a href="#" class="station-video">
      <i class="fas fa-play-circle mr-1"></i>Watch Video
    </a>
  </div>
  <p class="station-description">Practice proper batting stance and swing mechanics</p>
</div>
```
**Classes**:
- `station-block`: `p-4 bg-white rounded-lg border border-gray-200 mb-4`
- `station-header`: `flex items-center justify-between mb-2`
- `station-title`: `font-semibold text-braves-navy`
- `station-video`: `text-sm text-blue-600 hover:text-blue-800 transition-colors`
- `station-description`: `text-gray-600 text-sm`

### **Practice Editor Section**
```html
<div class="editor-section">
  <div class="editor-header">
    <i class="fas fa-edit text-braves-red mr-2"></i>
    <h3 class="editor-title">Edit Warmup</h3>
  </div>
  <div class="editor-content">
    <!-- Form fields -->
  </div>
</div>
```
**Classes**:
- `editor-section`: `mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200`
- `editor-header`: `flex items-center mb-4`
- `editor-title`: `text-lg font-semibold text-braves-navy`

---

## 🧭 Navigation

### **Tab Navigation**
```html
<div class="nav-tabs">
  <button class="nav-tab nav-tab-active">
    <i class="fas fa-baseball-ball mr-2"></i>Practices
  </button>
  <button class="nav-tab">
    <i class="fas fa-users mr-2"></i>Coaches
  </button>
  <button class="nav-tab">
    <i class="fas fa-history mr-2"></i>Activity
  </button>
</div>
```
**Classes**:
- `nav-tabs`: `flex border-b border-gray-200 bg-white rounded-t-xl`
- `nav-tab`: `flex-1 py-3 px-4 text-center font-semibold text-gray-500 hover:text-braves-navy transition-colors border-b-2 border-transparent`
- `nav-tab-active`: `text-braves-navy border-braves-red`

### **Practice Selector**
```html
<div class="practice-selector">
  <button class="practice-btn practice-btn-active">1</button>
  <button class="practice-btn">2</button>
  <button class="practice-btn">3</button>
  <!-- ... -->
</div>
```
**Classes**:
- `practice-selector`: `grid grid-cols-4 sm:grid-cols-8 gap-2 p-2`
- `practice-btn`: `w-12 h-12 rounded-lg bg-white border-2 border-transparent font-bold text-braves-navy hover:border-braves-red hover:transform hover:-translate-y-0.5 transition-all`
- `practice-btn-active`: `bg-braves-red text-white border-braves-red`

### **Breadcrumb Navigation**
```html
<nav class="breadcrumb">
  <a href="#" class="breadcrumb-item">Dashboard</a>
  <i class="fas fa-chevron-right breadcrumb-separator"></i>
  <a href="#" class="breadcrumb-item">Practices</a>
  <i class="fas fa-chevron-right breadcrumb-separator"></i>
  <span class="breadcrumb-current">Edit Practice 1</span>
</nav>
```
**Classes**:
- `breadcrumb`: `flex items-center space-x-2 text-sm mb-4`
- `breadcrumb-item`: `text-blue-600 hover:text-blue-800 transition-colors`
- `breadcrumb-separator`: `text-gray-400 text-xs`
- `breadcrumb-current`: `text-gray-600 font-medium`

---

## 📝 Forms

### **Form Field**
```html
<div class="form-field">
  <label class="form-label" for="title">Practice Title</label>
  <input type="text" id="title" class="form-input" placeholder="Enter practice title">
  <p class="form-help">Choose a descriptive title for this practice</p>
</div>
```
**Classes**:
- `form-field`: `mb-4`
- `form-label`: `block text-sm font-semibold text-gray-700 mb-2`
- `form-input`: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-braves-red focus:border-transparent transition-all`
- `form-help`: `text-xs text-gray-500 mt-1`

### **Textarea**
```html
<textarea class="form-textarea" rows="4" placeholder="Enter description"></textarea>
```
**Classes**: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-braves-red focus:border-transparent transition-all resize-vertical`

### **Select Dropdown**
```html
<select class="form-select">
  <option>Select option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```
**Classes**: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-braves-red focus:border-transparent transition-all bg-white`

### **Input Group**
```html
<div class="input-group">
  <input type="url" class="form-input" placeholder="YouTube URL">
  <button class="btn-secondary btn-sm">Find Videos</button>
</div>
```
**Classes**: `input-group`: `flex gap-2 items-end`

### **Form Validation States**
```html
<!-- Error State -->
<input class="form-input form-input-error" type="text">
<p class="form-error">This field is required</p>

<!-- Success State -->
<input class="form-input form-input-success" type="text">
<p class="form-success">Looks good!</p>
```
**Classes**:
- `form-input-error`: `border-red-500 focus:ring-red-300`
- `form-input-success`: `border-green-500 focus:ring-green-300`
- `form-error`: `text-red-600 text-xs mt-1`
- `form-success`: `text-green-600 text-xs mt-1`

---

## 🪟 Modals

### **Base Modal**
```html
<div class="modal-overlay">
  <div class="modal-container">
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>
      <button class="modal-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-content">
      <!-- Content -->
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```
**Classes**:
- `modal-overlay`: `fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4`
- `modal-container`: `bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto`
- `modal-header`: `flex items-center justify-between p-6 border-b border-gray-200`
- `modal-title`: `text-xl font-bold text-braves-navy`
- `modal-close`: `text-gray-400 hover:text-gray-600 transition-colors`
- `modal-content`: `p-6`
- `modal-footer`: `flex space-x-3 p-6 border-t border-gray-200`

### **Large Modal**
```html
<div class="modal-overlay">
  <div class="modal-container-lg">
    <!-- Content -->
  </div>
</div>
```
**Classes**: `modal-container-lg`: `bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto max-h-screen overflow-y-auto`

### **Full Screen Modal**
```html
<div class="modal-fullscreen">
  <div class="modal-fullscreen-container">
    <!-- Content -->
  </div>
</div>
```
**Classes**:
- `modal-fullscreen`: `fixed inset-0 bg-gray-100 z-40 overflow-y-auto`
- `modal-fullscreen-container`: `container mx-auto p-4 max-w-4xl`

---

## ⚡ States & Feedback

### **Loading States**
```html
<!-- Loading Spinner -->
<div class="loading-spinner"></div>

<!-- Loading Button -->
<button class="btn-primary" disabled>
  <i class="loading-spinner-sm mr-2"></i>
  Loading...
</button>

<!-- Loading Card -->
<div class="loading-card">
  <div class="loading-skeleton"></div>
</div>
```
**Classes**:
- `loading-spinner`: `inline-block w-6 h-6 border-2 border-gray-300 border-t-braves-red rounded-full animate-spin`
- `loading-spinner-sm`: `inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin`
- `loading-card`: `bg-gray-100 rounded-lg p-4 animate-pulse`
- `loading-skeleton`: `bg-gray-300 rounded h-4 w-3/4`

### **Alert Messages**
```html
<!-- Success Alert -->
<div class="alert alert-success">
  <i class="fas fa-check-circle mr-2"></i>
  Changes saved successfully!
</div>

<!-- Error Alert -->
<div class="alert alert-error">
  <i class="fas fa-exclamation-triangle mr-2"></i>
  Something went wrong. Please try again.
</div>

<!-- Info Alert -->
<div class="alert alert-info">
  <i class="fas fa-info-circle mr-2"></i>
  This is some helpful information.
</div>
```
**Classes**:
- `alert`: `p-4 rounded-lg border flex items-center text-sm font-medium`
- `alert-success`: `bg-green-50 border-green-200 text-green-800`
- `alert-error`: `bg-red-50 border-red-200 text-red-800`
- `alert-info`: `bg-blue-50 border-blue-200 text-blue-800`

### **Status Badges**
```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Inactive</span>
```
**Classes**:
- `badge`: `px-2 py-1 rounded-full text-xs font-semibold`
- `badge-success`: `bg-green-100 text-green-800`
- `badge-warning`: `bg-yellow-100 text-yellow-800`
- `badge-error`: `bg-red-100 text-red-800`

---

## 📱 Responsive Guidelines

### **Breakpoints**
- **Mobile**: Default styles (< 640px)
- **Tablet**: `sm:` prefix (≥ 640px)
- **Desktop**: `md:` prefix (≥ 768px)
- **Large**: `lg:` prefix (≥ 1024px)

### **Mobile-First Patterns**
```html
<!-- Responsive Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Cards -->
</div>

<!-- Responsive Text -->
<h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold">Title</h1>

<!-- Responsive Spacing -->
<div class="p-4 sm:p-6 lg:p-8">Content</div>

<!-- Responsive Navigation -->
<div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
  <!-- Practice buttons -->
</div>
```

### **Touch Targets**
- **Minimum Size**: 44px × 44px for touch targets
- **Button Padding**: `py-3 px-4` minimum for mobile
- **Icon Buttons**: `w-10 h-10` minimum

### **Mobile Optimizations**
```html
<!-- Stack on Mobile -->
<div class="flex flex-col sm:flex-row gap-3">
  <input class="flex-1">
  <button class="btn-primary">Submit</button>
</div>

<!-- Hide on Mobile -->
<span class="hidden sm:inline">Desktop Only Text</span>

<!-- Show on Mobile Only -->
<button class="sm:hidden">Mobile Menu</button>
```

---

## 💡 Usage Examples

### **Complete Practice Card**
```html
<div class="card-practice">
  <div class="practice-header">
    <div class="flex items-center justify-between">
      <h3 class="practice-title">Practice 1: Fundamentals</h3>
      <span class="practice-duration">45 minutes</span>
    </div>
  </div>
  
  <div class="practice-content space-y-4">
    <!-- Warmup Section -->
    <div class="practice-section">
      <div class="section-header">
        <i class="fas fa-running section-icon"></i>
        <h4 class="section-title">Warmup</h4>
        <span class="section-duration">5 min</span>
      </div>
      <div class="section-content">
        <p class="section-description">Dynamic stretching and light jogging around the bases</p>
      </div>
    </div>
    
    <!-- Stations -->
    <div class="space-y-3">
      <div class="station-block">
        <div class="station-header">
          <h5 class="station-title">Station 1: Hitting</h5>
          <a href="#" class="station-video">
            <i class="fas fa-play-circle mr-1"></i>Watch Video
          </a>
        </div>
        <p class="station-description">Practice proper batting stance and swing mechanics using tees</p>
      </div>
      
      <div class="station-block">
        <div class="station-header">
          <h5 class="station-title">Station 2: Fielding</h5>
          <a href="#" class="station-video">
            <i class="fas fa-play-circle mr-1"></i>Watch Video
          </a>
        </div>
        <p class="station-description">Ground ball fielding with proper glove positioning</p>
      </div>
    </div>
  </div>
</div>
```

### **Admin Dashboard Layout**
```html
<div class="modal-fullscreen">
  <div class="modal-fullscreen-container">
    <!-- Header -->
    <div class="card-admin mb-6">
      <div class="admin-card-header">
        <div class="flex items-center">
          <img src="logo.png" class="h-10 w-auto mr-3">
          <div>
            <h1 class="text-xl font-bold text-braves-navy">Admin Dashboard</h1>
            <p class="text-sm text-gray-600">Manage Practice Content</p>
          </div>
        </div>
        <button class="btn-secondary btn-sm">
          <i class="fas fa-sign-out-alt mr-2"></i>Logout
        </button>
      </div>
    </div>
    
    <!-- Navigation -->
    <div class="card-base mb-6">
      <div class="nav-tabs">
        <button class="nav-tab nav-tab-active">
          <i class="fas fa-baseball-ball mr-2"></i>Practices
        </button>
        <button class="nav-tab">
          <i class="fas fa-users mr-2"></i>Coaches
        </button>
        <button class="nav-tab">
          <i class="fas fa-history mr-2"></i>Activity
        </button>
      </div>
    </div>
    
    <!-- Content -->
    <div class="space-y-4">
      <!-- Practice cards will go here -->
    </div>
  </div>
</div>
```

### **Form with Validation**
```html
<form class="space-y-4">
  <div class="form-field">
    <label class="form-label" for="title">Practice Title</label>
    <input type="text" id="title" class="form-input" placeholder="Enter practice title" required>
  </div>
  
  <div class="form-field">
    <label class="form-label" for="description">Description</label>
    <textarea id="description" class="form-textarea" rows="3" placeholder="Describe this practice session"></textarea>
  </div>
  
  <div class="form-field">
    <label class="form-label" for="duration">Duration (minutes)</label>
    <input type="number" id="duration" class="form-input w-24" min="1" max="120" value="45">
  </div>
  
  <div class="input-group">
    <div class="form-field flex-1">
      <label class="form-label" for="video">Video URL</label>
      <input type="url" id="video" class="form-input" placeholder="https://youtube.com/...">
    </div>
    <button type="button" class="btn-secondary btn-sm mt-6">
      <i class="fas fa-search mr-2"></i>Find Videos
    </button>
  </div>
  
  <div class="flex space-x-3 pt-4">
    <button type="submit" class="btn-primary flex-1">
      <i class="fas fa-save mr-2"></i>Save Changes
    </button>
    <button type="button" class="btn-secondary">Cancel</button>
  </div>
</form>
```

---

## 🎯 Implementation Notes

### **CSS Custom Properties Integration**
The style guide leverages existing CSS custom properties while extending Tailwind's utility classes. This ensures consistency with the current design system.

### **Accessibility**
- All interactive elements have proper focus states
- Color contrast meets WCAG AA standards
- Touch targets are minimum 44px for mobile
- Semantic HTML structure is maintained

### **Performance**
- Utility-first approach reduces CSS bundle size
- Consistent class names improve caching
- Responsive design prevents layout shifts

### **Maintenance**
- Single source of truth for component styles
- Easy to update brand colors through CSS custom properties
- Clear naming conventions for developer experience

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Compatibility**: Tailwind CSS 3.x  
**Framework**: Vanilla JavaScript + Tailwind CSS
