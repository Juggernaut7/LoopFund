# LoopFund Project Context & Design System Guide

## 🎯 Project Overview
**LoopFund** is a comprehensive financial wellness platform with a custom design system. The project focuses on community-driven financial education, peer support groups, goal tracking, and financial planning tools.

## 🎨 LoopFund Design System

### Color Palette
```css
/* Primary Colors */
--loopfund-emerald-50: #ecfdf5
--loopfund-emerald-500: #10b981
--loopfund-emerald-600: #059669
--loopfund-emerald-700: #047857

/* Secondary Colors */
--loopfund-coral-50: #fef2f2
--loopfund-coral-500: #f87171
--loopfund-coral-600: #ef4444
--loopfund-coral-700: #dc2626

/* Accent Colors */
--loopfund-gold-500: #f59e0b
--loopfund-lavender-500: #a78bfa
--loopfund-electric-500: #3b82f6
--loopfund-mint-500: #06d6a0

/* Neutral Colors */
--loopfund-neutral-50: #fafafa
--loopfund-neutral-100: #f5f5f5
--loopfund-neutral-200: #e5e5e5
--loopfund-neutral-300: #d4d4d4
--loopfund-neutral-400: #a3a3a3
--loopfund-neutral-500: #737373
--loopfund-neutral-600: #525252
--loopfund-neutral-700: #404040
--loopfund-neutral-800: #262626
--loopfund-neutral-900: #171717

/* Dark Mode Colors */
--loopfund-dark-bg: #0a0a0a
--loopfund-dark-surface: #111111
--loopfund-dark-elevated: #1a1a1a
--loopfund-dark-text: #ffffff
```

### Typography
```css
/* Font Families */
font-display: 'Inter', system-ui, sans-serif
font-body: 'Inter', system-ui, sans-serif

/* Text Sizes */
text-h1: 2.25rem (36px)
text-h2: 1.875rem (30px)
text-h3: 1.5rem (24px)
text-h4: 1.25rem (20px)
text-h5: 1.125rem (18px)
text-h6: 1rem (16px)
text-body: 1rem (16px)
text-body-sm: 0.875rem (14px)
text-body-xs: 0.75rem (12px)
```

### Shadows
```css
shadow-loopfund: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
shadow-loopfund-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
shadow-loopfund-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
```

## 🧩 Core Components

### LoopFundButton
```jsx
import LoopFundButton from '../components/ui/LoopFundButton';

// Usage
<LoopFundButton
  variant="primary" // primary, secondary, outline, ghost
  size="lg" // sm, md, lg, xl
  icon={<Icon className="w-4 h-4" />}
  disabled={false}
  onClick={handleClick}
>
  Button Text
</LoopFundButton>
```

### LoopFundCard
```jsx
import { LoopFundCard } from '../components/ui/LoopFundCard';

// Usage
<LoopFundCard 
  variant="elevated" // default, elevated, outlined
  className="custom-classes"
>
  Card content
</LoopFundCard>
```

### LoopFundInput
```jsx
import { LoopFundInput } from '../components/ui/LoopFundInput';

// Usage
<LoopFundInput
  type="text"
  value={value}
  onChange={handleChange}
  placeholder="Enter text"
  className="w-full"
/>
```

## 🎭 Animation Guidelines

### Framer Motion Usage
```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>

// Hover effects
<motion.div
  whileHover={{ scale: 1.05, y: -2 }}
  transition={{ type: "spring", stiffness: 300 }}
>

// Staggered animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>
```

### Loading States
```jsx
// Standard loading spinner
<motion.div
  className="w-8 h-8 border-2 border-loopfund-emerald-500 border-t-transparent rounded-full"
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
/>

// Page loading with LoopFund branding
<div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
  <div className="flex items-center justify-center min-h-[60vh]">
    <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <motion.div
        className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
        Loading...
      </h2>
      <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
        Description of what's loading...
      </p>
    </motion.div>
  </div>
</div>
```

## 🚫 Design System Rules

### ❌ NEVER USE:
- **Blue colors** (any shade of blue) - this is a strict no-no
- Generic UI components (Button, Card, Input) - always use LoopFund components
- Hardcoded colors - always use LoopFund color variables
- Generic shadows - use LoopFund shadow classes
- Standard fonts - use LoopFund typography classes

### ✅ ALWAYS USE:
- LoopFund color palette (emerald, coral, gold, lavender, electric, mint, neutral)
- LoopFund components (LoopFundButton, LoopFundCard, LoopFundInput)
- LoopFund typography classes (font-display, font-body, text-h1, etc.)
- LoopFund shadows (shadow-loopfund, shadow-loopfund-lg, shadow-loopfund-xl)
- Dark mode support with proper color classes
- Framer Motion for animations and interactions

## 📁 Project Structure
```
frontend/src/
├── components/
│   ├── ui/                    # Core LoopFund components
│   │   ├── LoopFundButton.jsx
│   │   ├── LoopFundCard.jsx
│   │   └── LoopFundInput.jsx
│   ├── community/             # Community features
│   ├── invitations/           # Group invitation components
│   ├── modals/               # Modal components
│   └── layout/               # Layout components
├── pages/                    # Main application pages
├── store/                    # State management
├── context/                  # React contexts
└── services/                 # API services
```

## 🔧 Current Implementation Status

### ✅ Completed Features:
- **Community System**: Full revamp with LoopFund design system
  - CommunityPage.jsx with loading states
  - CommunityFeed.jsx with post cards and animations
  - PeerSupportGroups.jsx with group management
  - CommunityChallenges.jsx with challenge cards
  - CommunitySearch.jsx with search functionality
  - CommunityAnalytics.jsx with analytics dashboard

- **Navigation & Layout**: 
  - Sidebar.jsx with "Coming Soon" modal for Therapy Games
  - Layout.jsx with proper LoopFund styling

- **Core Pages**:
  - NotificationsPage.jsx - fully revamped
  - SettingsPage.jsx - fully revamped with tabs and forms
  - HelpPage.jsx - fully revamped with FAQs
  - CalendarPage.jsx - completely rewritten with robust calendar

- **Group Invitation System**:
  - JoinGroupLandingPage.jsx - fully revamped
  - JoinGroupPage.jsx - fully revamped with loading states
  - EmailInvitationPage.jsx - fully revamped
  - JoinGroupModal.jsx - fully revamped
  - InviteModal.jsx (both versions) - fully revamped with QR code functionality

- **Global Styling**:
  - index.css - updated CSS variables to LoopFund colors
  - tailwind.config.js - updated gradients and shadows
  - App.css - updated selection colors

### 🎯 Key Features Implemented:
- **QR Code Generation**: Full QR code functionality in invitation modals
- **Loading States**: Comprehensive loading states across all pages
- **Dark Mode**: Full dark mode support throughout the application
- **Animations**: Framer Motion animations and hover effects
- **Responsive Design**: Mobile-first responsive design
- **Error Handling**: Robust error handling and fallbacks

## 🛠️ Technical Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom LoopFund design system
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **QR Codes**: qrcode library
- **Routing**: React Router

## 📋 Development Guidelines

### Code Style:
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for all async operations
- Use TypeScript-style prop validation
- Follow LoopFund design system religiously

### File Naming:
- Components: PascalCase (e.g., `CommunityPage.jsx`)
- Utilities: camelCase (e.g., `formatDate.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### Import Order:
1. React and React-related imports
2. Third-party libraries
3. Internal components (UI first, then feature components)
4. Utilities and services
5. Types and constants

## 🎨 Visual Design Principles

### Gradients:
- Primary: `from-loopfund-emerald-500 to-loopfund-mint-500`
- Secondary: `from-loopfund-coral-500 to-loopfund-gold-500`
- Accent: `from-loopfund-electric-500 to-loopfund-lavender-500`

### Spacing:
- Use Tailwind spacing scale (p-4, m-6, space-y-4, etc.)
- Consistent spacing between sections
- Proper padding in cards and containers

### Border Radius:
- Small elements: `rounded-lg` (8px)
- Cards and containers: `rounded-xl` (12px)
- Large containers: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)

## 🚀 Getting Started Instructions

1. **Always check existing components** before creating new ones
2. **Use LoopFund components** - never create generic UI elements
3. **Follow the color palette** - no blue colors allowed
4. **Add loading states** for all async operations
5. **Implement dark mode** support for all new features
6. **Use Framer Motion** for smooth animations
7. **Test responsiveness** on mobile and desktop
8. **Add proper error handling** and fallbacks

## 📝 Recent Work Context

The project has been completely revamped to remove all "blue clichés" and implement the LoopFund design system throughout. All community features, invitation systems, and core pages have been updated. The QR code functionality for group invitations has been recently implemented and is working correctly.

**Current Focus**: The application is in a stable state with all major features implemented using the LoopFund design system. Any new features should follow the established patterns and design guidelines.

---

**Remember**: The LoopFund design system is the heart of this project. Every component, color, and interaction should reflect the brand's identity and provide a cohesive user experience.
