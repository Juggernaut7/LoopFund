# 🚀 LoopFund - Smart Savings Platform

## 🎓 **Academic Project - Final Year Project**
**This is a confidential academic project for final year studies. NOT open source.**

## 📋 **Project Overview**
LoopFund is a comprehensive smart savings platform that helps users achieve their financial goals through individual and group savings strategies. Built as a final year academic project demonstrating full-stack development skills with modern UI/UX design and payment integration.

## 🏗️ **Architecture**
- **Frontend**: React.js with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js with Express.js, MongoDB
- **Authentication**: JWT with OAuth integration
- **Payment**: Paystack integration for secure transactions
- **Real-time Features**: WebSocket integration for live updates

## ✨ **Key Features**

### 🎯 **Individual Goal Management**
- Personal savings targets with progress tracking
- Goal categorization (In Progress vs Completed)
- Smart contribution system with direct goal targeting
- Goal statistics dashboard with visual analytics
- Revenue model: First goal free, subsequent goals with 2-3% fee

### 👥 **Group Savings**
- Collaborative saving with friends and family
- Flexible duration options (Weekly, Monthly, Yearly)
- Dynamic fee calculation based on duration and amount
- Group progress tracking and member management
- Invitation system with email notifications

### 🎨 **Enhanced UI/UX**
- **Blue + Orange Color Theme**: Professional and modern design
- Responsive design optimized for all devices
- Smooth animations with Framer Motion
- Interactive components with hover effects
- Consistent design language across all pages

### 💳 **Payment Integration**
- Paystack integration for secure payment processing
- Dynamic fee calculation for goals and groups
- Payment verification and status tracking
- Webhook integration for real-time payment updates
- Support for Nigerian Naira (NGN) transactions

### 🏆 **Achievement System**
- Gamified savings with badges and milestones
- Real-time achievement tracking
- Community challenges and competitions
- Progress visualization with charts and graphs

### 📊 **Analytics Dashboard**
- Comprehensive financial insights
- Goal and group performance metrics
- Contribution history and patterns
- Revenue analytics for premium features

## 🔒 **Privacy & Security**
- **Confidential Project**: This is an academic submission
- **User Data Protection**: Secure authentication and data encryption
- **Payment Security**: PCI-compliant payment processing
- **No Public Access**: Private repository for academic purposes only

## 🛠️ **Technical Stack**

### Frontend
- **React 18+** with Hooks and Context API
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **Lucide React** for consistent iconography
- **Vite** for fast development and building

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **Paystack API** for payment processing
- **WebSocket** for real-time features
- **RESTful API** design with proper error handling

### Development Tools
- **ESLint** and **Prettier** for code quality
- **Git** for version control
- **Postman** for API testing
- **MongoDB Compass** for database management

## 📁 **Project Structure**
```
LoopFund/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ai/         # AI-powered components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── community/  # Community features
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   ├── payment/    # Payment-related components
│   │   │   └── ui/         # Generic UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layers
│   │   ├── store/          # State management
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   └── config/         # Configuration files
│   └── package.json
└── README.md
```

## 🚀 **Recent Updates (December 2024)**

### 🎨 **UI/UX Enhancements**
- **Color Theme Overhaul**: Implemented consistent Blue + Orange color scheme
- **Dashboard Improvements**: Enhanced visual hierarchy and component styling
- **Goal Page Redesign**: Added goal categorization, statistics dashboard, and improved contribution flow
- **Groups Page Enhancement**: Updated color palette and improved group card design
- **Create Group Page**: Added flexible duration options and enhanced user experience

### 💳 **Payment System Integration**
- **Paystack Integration**: Complete payment processing for goals and groups
- **Dynamic Fee Calculation**: Smart pricing based on duration and amount
- **Payment Verification**: Secure payment confirmation and status tracking
- **Revenue Model**: First goal free, subsequent goals with 2-3% fee

### 🔧 **Technical Improvements**
- **Component Optimization**: Improved React component structure and performance
- **Navigation Enhancement**: Added proper back navigation and routing
- **Error Handling**: Enhanced error handling and user feedback
- **Code Quality**: Improved code organization and maintainability

## 🏃‍♂️ **Quick Start**

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd LoopFund
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**
```bash
# Backend environment variables
cd backend
cp .env.example .env
# Edit .env with your configuration

# Frontend environment variables
cd ../frontend
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the application**
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend development server (from frontend directory)
npm run dev
```

## 🔧 **Configuration**

### Environment Variables

#### Backend (.env)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/loopfund

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Payment (Paystack)
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# Application
FRONTEND_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:4000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
```

## 📱 **API Documentation**

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Goal Management
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Group Management
- `GET /api/groups` - Get user groups
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/invite` - Invite members

### Payment Processing
- `POST /api/payments/initialize-goal` - Initialize goal payment
- `POST /api/payments/initialize-group` - Initialize group payment
- `GET /api/payments/verify/:reference` - Verify payment
- `POST /api/payments/calculate-fee` - Calculate payment fee

## 🧪 **Testing**

### Test Cards (Paystack Test Mode)
- **Visa**: 4084 0840 8408 4081
- **Mastercard**: 5043 8500 0000 0008
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **PIN**: Any 4 digits

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📊 **Features Showcase**

### 🎯 **Goal Management**
- Create and track personal savings goals
- Visual progress tracking with charts
- Direct contribution system
- Goal categorization and statistics

### 👥 **Group Savings**
- Create savings groups with friends
- Flexible duration options (1 week to 5 years)
- Dynamic fee calculation
- Member invitation and management

### 💳 **Payment System**
- Secure payment processing with Paystack
- Real-time payment verification
- Dynamic fee calculation
- Payment history and receipts

### 🏆 **Achievement System**
- Gamified savings experience
- Badge collection and milestones
- Community challenges
- Progress visualization

## 🔮 **Future Enhancements**

### Planned Features
- [ ] Mobile app development (React Native)
- [ ] Advanced AI financial advisor
- [ ] Investment tracking and recommendations
- [ ] Multi-currency support
- [ ] Advanced analytics and reporting
- [ ] Social features and community building

### Technical Improvements
- [ ] Microservices architecture
- [ ] Advanced caching strategies
- [ ] Real-time notifications
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Automated testing coverage

## 📞 **Support & Contact**

### Development Team
- **Lead Developer**: [Your Name]
- **Project Type**: Final Year Academic Project
- **Institution**: [Your University]
- **Academic Year**: 2024/2025

### Technical Support
- **Documentation**: Check individual component README files
- **Issues**: Use GitHub issues for bug reports
- **Questions**: Contact development team

## 📄 **License**
This project is developed as part of academic studies and is not intended for commercial use. All rights reserved.

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**Status**: Active Development  
**Maintainer**: LoopFund Development Team

## 🎉 **Acknowledgments**
- Paystack for payment processing services
- React and Node.js communities for excellent documentation
- Academic supervisors for guidance and support
- Beta testers for valuable feedback and suggestions
