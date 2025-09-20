/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CSS Variables for shadcn/ui compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // LoopFund Revolutionary Color Palette - Breaking Fintech Clichés
        loopfund: {
          // Primary Colors - Unique & Bold
          emerald: {
            50: '#e6fffa',
            100: '#ccfff5',
            200: '#99ffeb',
            300: '#66ffe1',
            400: '#33ffd7',
            500: '#00D4AA', // Main brand color - Growth, prosperity
            600: '#00b894',
            700: '#009c7a',
            800: '#008060',
            900: '#006446',
            950: '#004830',
          },
          coral: {
            50: '#fff5f5',
            100: '#ffe5e5',
            200: '#ffcccc',
            300: '#ffb3b3',
            400: '#ff9999',
            500: '#FF6B6B', // Warmth, human connection, trust
            600: '#e55a5a',
            700: '#cc4949',
            800: '#b23838',
            900: '#992727',
            950: '#801616',
          },
          midnight: {
            50: '#f8f9fa',
            100: '#f1f3f4',
            200: '#e8eaed',
            300: '#dadce0',
            400: '#bdc1c6',
            500: '#9aa0a6',
            600: '#80868b',
            700: '#5f6368',
            800: '#3c4043',
            900: '#1A1D29', // Sophistication, depth, premium
            950: '#0f1419',
          },
          // Secondary Colors - Harmonious Support
          gold: {
            50: '#fffdf0',
            100: '#fffbe0',
            200: '#fff7c1',
            300: '#fff3a2',
            400: '#ffef83',
            500: '#FFD93D', // Success, achievement, celebration
            600: '#e6c337',
            700: '#ccad31',
            800: '#b3972b',
            900: '#998125',
            950: '#806b1f',
          },
          lavender: {
            50: '#f8f8ff',
            100: '#f1f1ff',
            200: '#e3e3ff',
            300: '#d5d5ff',
            400: '#c7c7ff',
            500: '#A8A8FF', // Calm, wisdom, financial peace
            600: '#9797e6',
            700: '#8686cc',
            800: '#7575b3',
            900: '#646499',
            950: '#535380',
          },
          mint: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#6BCF7F', // Fresh starts, new opportunities
            600: '#60ba72',
            700: '#55a565',
            800: '#4a9058',
            900: '#3f7b4b',
            950: '#34663e',
          },
          // Accent Colors - High Impact
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#FF8C42', // Urgency, action, CTAs
            600: '#e67e3b',
            700: '#cc7034',
            800: '#b3622d',
            900: '#995426',
            950: '#80461f',
          },
          electric: {
            50: '#f0fdff',
            100: '#ccf7ff',
            200: '#99efff',
            300: '#66e7ff',
            400: '#33dfff',
            500: '#00F5FF', // Innovation, tech, future
            600: '#00dde6',
            700: '#00c5cc',
            800: '#00adb3',
            900: '#009599',
            950: '#007d80',
          },
          // Neutral Foundation - Premium Feel
          neutral: {
            50: '#FFFFFF',
            100: '#FEFCF7', // Warm, human, not sterile
            200: '#F5F7FA', // Light backgrounds
            300: '#E8ECF0', // Subtle borders
            400: '#D1D9E0', // Disabled states
            500: '#9CA3AF', // Placeholder text
            600: '#6B7280', // Secondary text
            700: '#4B5563', // Primary text
            800: '#374151', // Headings
            900: '#1F2937', // Dark text
            950: '#111827', // Darkest text
          },
          // Dark Mode - Cohesive & Premium
          dark: {
            bg: '#0A0B0F', // Deep space background
            surface: '#151821', // Card surfaces
            elevated: '#1E2029', // Elevated surfaces
            text: '#E5E7EB', // Primary text
            muted: '#9CA3AF', // Secondary text
          }
        },
        
        // Legacy colors for backward compatibility
        synergy: {
          50: '#e6f3ff',
          100: '#cce7ff',
          200: '#99cfff',
          300: '#66b7ff',
          400: '#339fff',
          500: '#0066CC',
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001429',
          950: '#000a14',
        },
        velocity: {
          50: '#e6fffa',
          100: '#ccfff5',
          200: '#99ffeb',
          300: '#66ffe1',
          400: '#33ffd7',
          500: '#00C49F',
          600: '#009d7f',
          700: '#00765f',
          800: '#004e3f',
          900: '#002720',
          950: '#001310',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // LoopFund Revolutionary Typography System
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'], // Primary - Distinctive & Modern
        'body': ['Inter', 'system-ui', 'sans-serif'], // Secondary - Clean & Readable
        'mono': ['JetBrains Mono', 'monospace'], // Technical - Numbers & Data
        'sans': ['Inter', 'system-ui', 'sans-serif'], // Fallback
      },
      fontSize: {
        // Display Headings - Hero & Impact
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }], // 72px
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }], // 60px
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }], // 48px
        
        // Headings - Hierarchy
        'h1': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }], // 36px
        'h2': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }], // 30px
        'h3': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.025em' }], // 24px
        'h4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.025em' }], // 20px
        'h5': ['1.125rem', { lineHeight: '1.45', letterSpacing: '-0.025em' }], // 18px
        
        // Body Text - Readability
        'body-xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0em' }], // 20px
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0em' }], // 18px
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0em' }], // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0em' }], // 14px
        'body-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }], // 12px
        
        // Legacy sizes for backward compatibility
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      animation: {
        // LoopFund Revolutionary Animation System - Maximum Impact
        
        // Page Transitions - Smooth & Directional
        'slide-up-in': 'slideUpIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down-in': 'slideDownIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-scale-in': 'fadeScaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'flip-in': 'flipIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        
        // Scroll Animations - Parallax & Reveal
        'fade-in-scroll': 'fadeInScroll 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up-scroll': 'slideUpScroll 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-left-scroll': 'slideLeftScroll 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right-scroll': 'slideRightScroll 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in-scroll': 'scaleInScroll 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        
        // Hover Interactions - Delightful & Responsive
        'hover-lift': 'hoverLift 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'hover-scale': 'hoverScale 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'hover-rotate': 'hoverRotate 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'hover-glow': 'hoverGlow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Loading Animations - Engaging & Branded
        'loopfund-spin': 'loopfundSpin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'progress-fill': 'progressFill 1s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Micro-interactions - Every Detail Matters
        'ripple': 'ripple 0.6s ease-out',
        'checkmark': 'checkmark 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'success-bounce': 'successBounce 1s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        
        // Data Animations - Financial Growth Visualization
        'count-up': 'countUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'draw-line': 'drawLine 2s cubic-bezier(0.4, 0, 0.2, 1)',
        'grow-bar': 'growBar 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'reveal-pie': 'revealPie 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        
        // Unique Features - Interactive Backgrounds
        'float': 'float 6s ease-in-out infinite',
        'mesh-move': 'meshMove 20s ease-in-out infinite',
        'confetti': 'confetti 3s ease-out forwards',
        'badge-pop': 'badgePop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        
        // Legacy animations for backward compatibility
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        // LoopFund Revolutionary Keyframes - Maximum Impact
        
        // Page Transitions - Smooth & Directional
        slideUpIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDownIn: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeScaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        flipIn: {
          '0%': { opacity: '0', transform: 'perspective(1000px) rotateY(-90deg)' },
          '100%': { opacity: '1', transform: 'perspective(1000px) rotateY(0deg)' },
        },
        
        // Scroll Animations - Parallax & Reveal
        fadeInScroll: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUpScroll: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeftScroll: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRightScroll: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleInScroll: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        
        // Hover Interactions - Delightful & Responsive
        hoverLift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-4px) scale(1.02)' },
        },
        hoverScale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        hoverRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(5deg)' },
        },
        hoverGlow: {
          '0%': { boxShadow: '0 0 0 rgba(0, 212, 170, 0)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 170, 0.3)' },
        },
        
        // Loading Animations - Engaging & Branded
        loopfundSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            opacity: '1', 
            boxShadow: '0 0 20px rgba(0, 212, 170, 0.3)' 
          },
          '50%': { 
            opacity: '0.7', 
            boxShadow: '0 0 40px rgba(0, 212, 170, 0.6)' 
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width, 0%)' },
        },
        
        // Micro-interactions - Every Detail Matters
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        checkmark: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        successBounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        
        // Data Animations - Financial Growth Visualization
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        growBar: {
          '0%': { height: '0' },
          '100%': { height: 'var(--bar-height, 100%)' },
        },
        revealPie: {
          '0%': { transform: 'rotate(-90deg) scale(0)' },
          '100%': { transform: 'rotate(0deg) scale(1)' },
        },
        
        // Unique Features - Interactive Backgrounds
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        meshMove: {
          '0%, 100%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%' },
          '50%': { backgroundPosition: '100% 100%, 0% 0%, 25% 75%' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
        badgePop: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        
        // Legacy keyframes for backward compatibility
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        // LoopFund Revolutionary Spacing Scale - 8px Base with Golden Ratio
        '0': '0px',
        '1': '0.25rem',    // 4px
        '2': '0.5rem',     // 8px
        '3': '0.75rem',    // 12px
        '4': '1rem',       // 16px
        '5': '1.25rem',    // 20px
        '6': '1.5rem',     // 24px
        '8': '2rem',       // 32px
        '10': '2.5rem',    // 40px
        '12': '3rem',      // 48px
        '16': '4rem',      // 64px
        '20': '5rem',      // 80px
        '24': '6rem',      // 96px
        '32': '8rem',      // 128px
        '40': '10rem',     // 160px
        '48': '12rem',     // 192px
        '56': '14rem',     // 224px
        '64': '16rem',     // 256px
      },
      backgroundImage: {
        // LoopFund Revolutionary Gradient System - Unique & Bold
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        
        // Primary Gradients - Breaking Fintech Clichés
        'gradient-loopfund': 'linear-gradient(135deg, #00D4AA 0%, #6BCF7F 100%)', // Emerald to Mint
        'gradient-loopfund-reverse': 'linear-gradient(135deg, #6BCF7F 0%, #00D4AA 100%)',
        'gradient-coral': 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)', // Coral to Orange
        'gradient-gold': 'linear-gradient(135deg, #FFD93D 0%, #FF8C42 100%)', // Gold to Orange
        'gradient-electric': 'linear-gradient(135deg, #00F5FF 0%, #A8A8FF 100%)', // Electric to Lavender
        
        // Complex Gradients - Multi-stop
        'gradient-hero': 'linear-gradient(135deg, #00D4AA 0%, #6BCF7F 50%, #FFD93D 100%)',
        'gradient-mesh': 'radial-gradient(circle at 20% 80%, rgba(0, 212, 170, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 217, 61, 0.1) 0%, transparent 50%)',
        
        // Legacy gradients for backward compatibility
        'gradient-synergy': 'linear-gradient(135deg, #00D4AA 0%, #6BCF7F 100%)',
        'gradient-synergy-reverse': 'linear-gradient(135deg, #6BCF7F 0%, #00D4AA 100%)',
      },
      boxShadow: {
        // LoopFund Revolutionary Shadow System - Depth & Personality
        'loopfund-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'loopfund': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'loopfund-md': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'loopfund-lg': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'loopfund-xl': '0 32px 80px rgba(0, 0, 0, 0.2)',
        
        // Glow Effects - Brand Colors
        'glow-emerald': '0 0 20px rgba(0, 212, 170, 0.3)',
        'glow-coral': '0 0 20px rgba(255, 107, 107, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 217, 61, 0.3)',
        'glow-electric': '0 0 20px rgba(0, 245, 255, 0.3)',
        
        // Interactive Shadows
        'glow-hover': '0 0 30px rgba(0, 212, 170, 0.4)',
        'glow-focus': '0 0 0 3px rgba(0, 212, 170, 0.1)',
        
        // Legacy shadows for backward compatibility
        'glow': '0 0 20px rgba(0, 212, 170, 0.3)',
        'glow-teal': '0 0 20px rgba(0, 212, 170, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 212, 170, 0.2)',
      },
    },
  },
  plugins: [],
}

