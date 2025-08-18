# 💰 LoopFund - Individual & Group Savings Platform

<!-- This is a test comment to verify auto-accept is disabled -->

A modern, intuitive web application that enables users to save money individually for personal goals or collaboratively with friends and family towards shared financial objectives. Built with cutting-edge frontend technologies and beautiful animations.

## ✨ Features

### 🎨 **Frontend Excellence**
- **Modern UI/UX** - Beautiful, responsive design with glassmorphism effects
- **Advanced Animations** - Sophisticated SVG animations and Framer Motion transitions
- **Dark/Light Mode** - Seamless theme switching with persistent preferences
- **Interactive Components** - Hover effects, loading states, and micro-interactions

### 🔐 **Authentication System**
- **Sign Up/Sign In** - Clean, modern authentication pages
- **Forgot Password** - Complete password reset flow
- **Social Login** - Google OAuth integration
- **Form Validation** - Real-time validation with error handling

### 📱 **Dashboard & Navigation**
- **Collapsible Sidebar** - Modern navigation with submenus and badges
- **Top Navigation Bar** - Search, notifications, user menu, and theme toggle
- **Responsive Design** - Mobile-first approach with tablet and desktop optimization
- **Floating Action Button** - Quick access to common actions

### 🎯 **State Management**
- **Zustand Integration** - Lightweight, performant state management
- **Persistent Storage** - User preferences and data persistence
- **Multiple Stores** - Auth, Goals, Groups, and Notifications stores

### 💰 **Savings Features**
- **Individual Savings** - Save for personal goals like vacations, gadgets, education
- **Group Savings** - Collaborate with friends and family for shared objectives
- **Goal Tracking** - Visual progress tracking with beautiful animations
- **Smart Automation** - Automated savings, reminders, and smart suggestions
- **Progress Analytics** - Detailed insights for both individual and group savings

## 🚀 Tech Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **Lottie React** - High-quality animations

### Backend (In Progress)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Swagger** - API documentation

## 🎨 UI/UX Highlights

### Landing Page
- **Hero Section** - Compelling value proposition with Lottie animations
- **Feature Showcase** - Interactive sections highlighting individual and group savings
- **Goal Examples** - Visual examples of both individual and group savings goals
- **Testimonials** - Social proof from individual and group savers
- **Call-to-Action** - Clear conversion paths

### Authentication Pages
- **Split Layout** - Form on left, animated illustration on right
- **Advanced Animations** - Meaningful network visualization showcasing app architecture
- **Form Validation** - Real-time feedback and error handling
- **Social Login** - One-click Google authentication

### Dashboard
- **Dual Stats Cards** - Separate tracking for individual and group savings
- **Progress Rings** - Visual goal tracking with smooth animations
- **Recent Activity** - Timeline of individual and group activities
- **Weather Widget** - Ambient information display
- **Floating Actions** - Quick access to common tasks

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Juggernaut7/LoopFund.git
cd LoopFund

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=LoopFund
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Sidebar, TopNav, etc.)
│   │   ├── ui/             # Reusable UI components
│   │   └── dashboard/      # Dashboard-specific components
│   ├── pages/              # Page components
│   ├── context/            # React Context providers
│   ├── store/              # Zustand stores
│   ├── assets/             # Static assets
│   └── styles/             # Global styles
├── public/                 # Public assets
└── package.json
```

## 🎯 Key Components

### AnimatedNetwork
A sophisticated SVG animation that visualizes the app's architecture with:
- **Meaningful Nodes** - Each node represents actual app functionality
- **Dynamic Connections** - Lines showing data flow between features
- **Interactive States** - Hover effects and status indicators
- **Data Flow Animation** - Particles flowing along active connections

### Theme System
- **Context-based** - React Context for theme management
- **Persistent** - Local storage for user preferences
- **System-aware** - Respects user's system theme preference
- **Smooth transitions** - Animated theme switching

### State Management
- **Auth Store** - User authentication and session management
- **Goals Store** - Individual and group goal creation, tracking, and management
- **Groups Store** - Group management and member handling
- **Notifications Store** - Real-time notifications and preferences

## 🚧 Development Status

### ✅ Completed
- [x] Landing page with individual and group savings focus
- [x] Authentication system (Sign Up, Sign In, Forgot Password)
- [x] Dashboard layout with dual savings tracking
- [x] Theme system (dark/light mode)
- [x] State management with Zustand
- [x] Advanced UI components
- [x] Responsive design
- [x] Interactive animations

### 🔄 In Progress
- [ ] Backend API development
- [ ] Database integration
- [ ] Payment processing
- [ ] Real-time features

### 📋 Planned
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Social features
- [ ] Achievement system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** - For amazing animation capabilities
- **Tailwind CSS** - For rapid UI development
- **Lucide Icons** - For beautiful, consistent icons
- **React Community** - For excellent documentation and tools

---

**Built with ❤️ for individual and collaborative financial success** 