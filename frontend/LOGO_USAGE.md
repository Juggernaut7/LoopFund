# LoopFund Logo Usage Guide

## 🎨 Logo Components

### 1. Main Logo Component (`Logo.jsx`)
The primary logo component with multiple size variants and customization options.

**Props:**
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' (default: 'md')
- `showText`: boolean (default: true) - Show/hide "LoopFund" text
- `className`: string - Additional CSS classes
- `onClick`: function - Click handler
- `animated`: boolean (default: true) - Enable/disable entrance animation

**Usage Examples:**
```jsx
// Navigation logo
<Logo size="md" showText={true} />

// Icon only (for buttons, badges)
<Logo size="sm" showText={false} />

// Large hero logo
<Logo size="2xl" showText={true} />

// Clickable logo (scrolls to top)
<Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
```

### 2. Favicon Logo (`FaviconLogo.jsx`)
Minimal logo component for favicon and app icon usage.

**Props:**
- `size`: number (default: 32) - Size in pixels
- `className`: string - Additional CSS classes

**Usage:**
```jsx
<FaviconLogo size={64} />
```

### 3. Loading Screen (`LoadingScreen.jsx`)
Professional loading screen featuring the logo with animations.

**Props:**
- `isLoading`: boolean (default: true) - Show/hide loading screen

**Usage:**
```jsx
<LoadingScreen isLoading={true} />
```

## 📍 Integration Points

### Navigation Bar
- **Location**: Top of every page
- **Size**: Medium (md)
- **Features**: Clickable, scrolls to top
- **Animation**: Entrance animation enabled

### Footer
- **Location**: Bottom of every page
- **Size**: Large (lg)
- **Features**: Static display
- **Animation**: Disabled for stability

### Hero Section
- **Location**: Trust badge in hero section
- **Size**: Extra small (xs)
- **Features**: Icon only, no text
- **Animation**: Disabled

### Loading Screen
- **Location**: Full-screen overlay
- **Size**: Extra large (2xl)
- **Features**: Animated logo with loading dots
- **Animation**: Pulse and rotation effects

## 🎯 Brand Guidelines

### Color Usage
- **Primary Gradient**: Synergy Blue (#0066CC) to Velocity Teal (#00C49F)
- **Text Gradient**: Applied to "LoopFund" text
- **Background**: Transparent with subtle border
- **Dark Mode**: Automatically adapts to theme

### Sizing Guidelines
- **xs (24px)**: Badges, small buttons
- **sm (32px)**: Icons, compact spaces
- **md (40px)**: Navigation, standard usage
- **lg (48px)**: Footer, prominent display
- **xl (64px)**: Hero sections, large displays
- **2xl (80px)**: Loading screens, maximum impact

### Animation Guidelines
- **Entrance**: Slide in from left with fade
- **Loading**: Gentle pulse and rotation
- **Hover**: Subtle scale effect (when clickable)
- **Duration**: 0.5s for entrance, 2s for loading loops

## 🔧 Technical Implementation

### File Structure
```
src/
├── assets/
│   └── logo.jpg          # Source logo file
├── components/
│   └── ui/
│       ├── Logo.jsx      # Main logo component
│       ├── FaviconLogo.jsx # Favicon version
│       └── LoadingScreen.jsx # Loading screen
└── public/
    └── favicon.jpg       # Favicon for browser
```

### CSS Classes Used
- `text-gradient-static`: Brand gradient text
- `shadow-glow`: Subtle glow effect
- `border-white/20`: Semi-transparent border
- `rounded-xl`: Consistent border radius

### Responsive Behavior
- Scales appropriately on all screen sizes
- Maintains aspect ratio
- Text size adjusts with logo size
- Mobile-optimized touch targets

## 🚀 Best Practices

### Do's ✅
- Use consistent sizing across similar contexts
- Maintain proper spacing around the logo
- Ensure sufficient contrast on all backgrounds
- Use the animated version for initial page loads
- Keep the logo clickable in navigation

### Don'ts ❌
- Don't stretch or distort the logo
- Don't use colors outside the brand palette
- Don't place on busy backgrounds without proper contrast
- Don't use extremely small sizes that reduce readability
- Don't animate excessively in critical UI areas

### Accessibility
- Always include proper alt text
- Ensure sufficient color contrast
- Provide clickable areas for interactive logos
- Support keyboard navigation
- Maintain focus indicators

## 🎨 Customization

### Adding New Sizes
```jsx
// In Logo.jsx, add to sizeClasses object
const sizeClasses = {
  // ... existing sizes
  '3xl': 'w-24 h-24',  // 96px
  '4xl': 'w-32 h-32',  // 128px
};
```

### Custom Animations
```jsx
// Custom entrance animation
<motion.div
  initial={{ opacity: 0, rotate: -180 }}
  animate={{ opacity: 1, rotate: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
>
  <Logo />
</motion.div>
```

### Theme Integration
The logo automatically adapts to light/dark themes using CSS variables and Tailwind classes.

---

*This guide ensures consistent, professional logo usage across the LoopFund application while maintaining brand integrity and user experience.*
