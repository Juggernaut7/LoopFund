import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Globe, 
  Home, 
  Settings,
  Zap,
  Star,
  Target,
  TrendingUp,
  Shield,
  Rocket,
  CheckCircle,
  Clock,
  Lock
} from 'lucide-react';

const AnimatedNetwork = () => {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeConnections, setActiveConnections] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Meaningful nodes that represent actual app functionality
  const nodes = [
    { 
      id: 1, 
      cx: 60, 
      cy: 60, 
      icon: Users, 
      label: 'Connect', 
      type: 'primary', 
      size: 16, 
      pulse: true,
      description: 'Join savings groups',
      status: 'active',
      connections: [2, 5, 7]
    },
    { 
      id: 2, 
      cx: 180, 
      cy: 80, 
      icon: MessageCircle, 
      label: 'Chat', 
      type: 'secondary', 
      size: 14, 
      pulse: true,
      description: 'Group communication',
      status: 'active',
      connections: [1, 3, 6]
    },
    { 
      id: 3, 
      cx: 120, 
      cy: 160, 
      icon: Heart, 
      label: 'Share', 
      type: 'accent', 
      size: 15, 
      pulse: false,
      description: 'Share progress',
      status: 'idle',
      connections: [2, 4, 10]
    },
    { 
      id: 4, 
      cx: 220, 
      cy: 140, 
      icon: Globe, 
      label: 'Discover', 
      type: 'primary', 
      size: 16, 
      pulse: true,
      description: 'Find new groups',
      status: 'active',
      connections: [1, 3, 9]
    },
    { 
      id: 5, 
      cx: 80, 
      cy: 120, 
      icon: Home, 
      label: 'Home', 
      type: 'secondary', 
      size: 14, 
      pulse: false,
      description: 'Dashboard hub',
      status: 'idle',
      connections: [1, 6, 12]
    },
    { 
      id: 6, 
      cx: 200, 
      cy: 100, 
      icon: Settings, 
      label: 'Settings', 
      type: 'accent', 
      size: 15, 
      pulse: true,
      description: 'App configuration',
      status: 'active',
      connections: [2, 5, 11]
    },
    { 
      id: 7, 
      cx: 140, 
      cy: 40, 
      icon: Zap, 
      label: 'Power', 
      type: 'primary', 
      size: 13, 
      pulse: true,
      description: 'Quick actions',
      status: 'active',
      connections: [1, 9, 12]
    },
    { 
      id: 8, 
      cx: 40, 
      cy: 180, 
      icon: Star, 
      label: 'Premium', 
      type: 'accent', 
      size: 14, 
      pulse: false,
      description: 'VIP features',
      status: 'locked',
      connections: [5, 10, 11]
    },
    { 
      id: 9, 
      cx: 240, 
      cy: 60, 
      icon: Target, 
      label: 'Goals', 
      type: 'secondary', 
      size: 15, 
      pulse: true,
      description: 'Set targets',
      status: 'active',
      connections: [4, 7, 10]
    },
    { 
      id: 10, 
      cx: 100, 
      cy: 200, 
      icon: TrendingUp, 
      label: 'Growth', 
      type: 'primary', 
      size: 13, 
      pulse: true,
      description: 'Track progress',
      status: 'active',
      connections: [3, 8, 9, 11]
    },
    { 
      id: 11, 
      cx: 160, 
      cy: 200, 
      icon: Shield, 
      label: 'Security', 
      type: 'accent', 
      size: 14, 
      pulse: false,
      description: 'Data protection',
      status: 'idle',
      connections: [6, 8, 10]
    },
    { 
      id: 12, 
      cx: 20, 
      cy: 100, 
      icon: Rocket, 
      label: 'Launch', 
      type: 'primary', 
      size: 15, 
      pulse: true,
      description: 'Get started',
      status: 'active',
      connections: [1, 5, 7]
    }
  ];

  // Dynamic connections with meaning and flow
  const connections = [
    { from: 1, to: 2, type: 'primary', strength: 0.8, flow: 'bidirectional', data: 'messages' },
    { from: 2, to: 3, type: 'secondary', strength: 0.6, flow: 'unidirectional', data: 'notifications' },
    { from: 3, to: 4, type: 'accent', strength: 0.9, flow: 'bidirectional', data: 'discoveries' },
    { from: 4, to: 1, type: 'primary', strength: 0.7, flow: 'bidirectional', data: 'connections' },
    { from: 1, to: 5, type: 'secondary', strength: 0.5, flow: 'unidirectional', data: 'navigation' },
    { from: 2, to: 6, type: 'accent', strength: 0.8, flow: 'bidirectional', data: 'preferences' },
    { from: 5, to: 6, type: 'primary', strength: 0.6, flow: 'bidirectional', data: 'config' },
    { from: 7, to: 1, type: 'accent', strength: 0.9, flow: 'unidirectional', data: 'actions' },
    { from: 8, to: 5, type: 'secondary', strength: 0.7, flow: 'unidirectional', data: 'upgrades' },
    { from: 9, to: 4, type: 'primary', strength: 0.8, flow: 'bidirectional', data: 'targets' },
    { from: 10, to: 3, type: 'accent', strength: 0.6, flow: 'bidirectional', data: 'analytics' },
    { from: 11, to: 6, type: 'secondary', strength: 0.7, flow: 'unidirectional', data: 'security' },
    { from: 12, to: 1, type: 'primary', strength: 0.9, flow: 'unidirectional', data: 'onboarding' },
    { from: 7, to: 9, type: 'accent', strength: 0.8, flow: 'bidirectional', data: 'quick-goals' },
    { from: 8, to: 10, type: 'secondary', strength: 0.6, flow: 'unidirectional', data: 'premium-features' },
    { from: 10, to: 11, type: 'primary', strength: 0.7, flow: 'bidirectional', data: 'secure-growth' }
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Transform mouse position for effects
  const mouseXTransform = useTransform(mouseX, [0, 280], [-20, 20]);
  const mouseYTransform = useTransform(mouseY, [0, 240], [-20, 20]);

  // Start animations
  useEffect(() => {
    controls.start({
      opacity: 1,
      transition: { duration: 1, staggerChildren: 0.1 }
    });

    // Simulate active connections
    const interval = setInterval(() => {
      const randomConnections = connections
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(c => c.from + '-' + c.to);
      setActiveConnections(randomConnections);
    }, 2000);

    return () => clearInterval(interval);
  }, [controls]);

  const getNodeColor = (type, status) => {
    if (status === 'locked') return '#6B7280';
    
    switch (type) {
      case 'primary': return '#8B5CF6';
      case 'secondary': return '#06B6D4';
      case 'accent': return '#F59E0B';
      default: return '#8B5CF6';
    }
  };

  const getNodeGradient = (type, status) => {
    if (status === 'locked') return 'url(#lockedGradient)';
    
    switch (type) {
      case 'primary': return 'url(#primaryGradient)';
      case 'secondary': return 'url(#secondaryGradient)';
      case 'accent': return 'url(#accentGradient)';
      default: return 'url(#primaryGradient)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'idle': return <Clock className="w-3 h-3 text-yellow-400" />;
      case 'locked': return <Lock className="w-3 h-3 text-gray-400" />;
      default: return <CheckCircle className="w-3 h-3 text-red-400" />;
    }
  };

  const handleNodeHover = (nodeId) => {
    setHoveredNode(nodeId);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 280 240">
        {/* Advanced gradient definitions */}
        <defs>
          {/* Primary gradient */}
          <radialGradient id="primaryGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#7C3AED', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#5B21B6', stopOpacity: 0.4 }} />
          </radialGradient>
          
          {/* Secondary gradient */}
          <radialGradient id="secondaryGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#0891B2', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#0E7490', stopOpacity: 0.4 }} />
          </radialGradient>
          
          {/* Accent gradient */}
          <radialGradient id="accentGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#D97706', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#B45309', stopOpacity: 0.4 }} />
          </radialGradient>

          {/* Locked gradient */}
          <radialGradient id="lockedGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#6B7280', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#374151', stopOpacity: 0.4 }} />
          </radialGradient>

          {/* Glow effects */}
          <filter id="glow-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Connection line gradients */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#A855F7', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: '#06B6D4', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 0.8 }} />
          </linearGradient>

          {/* Data flow gradient */}
          <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Animated connection lines with meaning */}
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          const isActive = activeConnections.includes(`${connection.from}-${connection.to}`);
          
          return (
            <g key={`connection-${index}`}>
              {/* Main connection line */}
              <motion.line
                x1={fromNode.cx}
                y1={fromNode.cy}
                x2={toNode.cx}
                y2={toNode.cy}
                stroke="url(#connectionGradient)"
                strokeWidth={isActive ? 3 + connection.strength * 2 : 1 + connection.strength}
                opacity={isActive ? 0.8 : 0.4}
                filter="url(#glow-effect)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: isActive ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
                  strokeDasharray: isActive ? [0, 20, 0] : [0, 0, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: 'reverse', 
                  ease: 'easeInOut',
                  delay: index * 0.1 
                }}
              />
              
              {/* Data flow particles along connections */}
              {isActive && [...Array(3)].map((_, i) => (
                <motion.circle
                  key={`flow-${index}-${i}`}
                  r="2"
                  fill="url(#dataFlowGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    cx: [fromNode.cx, toNode.cx],
                    cy: [fromNode.cy, toNode.cy]
                  }}
                  transition={{ 
                    duration: 2 + connection.strength,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                />
              ))}
            </g>
          );
        })}

        {/* Advanced animated nodes with meaning */}
        {nodes.map((node) => {
          const IconComponent = node.icon;
          const nodeColor = getNodeColor(node.type, node.status);
          const nodeGradient = getNodeGradient(node.type, node.status);
          const isHovered = hoveredNode === node.id;
          
          return (
            <g key={node.id}>
              {/* Outer orbital rings */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="25"
                fill="none"
                stroke={nodeColor}
                strokeWidth="1"
                opacity="0.3"
                initial={{ rotate: 0, scale: 0 }}
                animate={{ 
                  rotate: 360,
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.1, 0.4, 0.1]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: node.id * 0.2 
                }}
              />
              
              {/* Secondary orbital ring */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="20"
                fill="none"
                stroke={nodeColor}
                strokeWidth="0.5"
                opacity="0.2"
                initial={{ rotate: 0, scale: 0 }}
                animate={{ 
                  rotate: -360,
                  scale: [1.2, 0.8, 1.2],
                  opacity: [0.2, 0.1, 0.2]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: node.id * 0.3 
                }}
              />
              
              {/* Main node glow */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.size + 4}
                fill={nodeGradient}
                filter="url(#glow-effect)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: node.pulse ? [0.8, 1.3, 0.8] : 1,
                  opacity: node.pulse ? [0.4, 1, 0.4] : 0.8
                }}
                transition={{ 
                  duration: node.pulse ? 2 : 1, 
                  repeat: node.pulse ? Infinity : 0, 
                  ease: "easeInOut",
                  delay: node.id * 0.1 
                }}
                onMouseEnter={() => handleNodeHover(node.id)}
                onMouseLeave={handleNodeLeave}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Core node */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.size}
                fill={nodeGradient}
                filter="url(#star-glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: node.id * 0.1 
                }}
              />
              
              {/* Icon with dynamic positioning */}
              <motion.foreignObject
                x={node.cx - 8}
                y={node.cy - 8}
                width="16"
                height="16"
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: 0,
                  x: isHovered ? [node.cx - 8 + mouseXTransform.get() * 0.1, node.cx - 8] : node.cx - 8,
                  y: isHovered ? [node.cy - 8 + mouseYTransform.get() * 0.1, node.cy - 8] : node.cy - 8
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: node.id * 0.1 + 0.5,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-white drop-shadow-lg" />
                </div>
              </motion.foreignObject>
              
              {/* Status indicator */}
              <motion.foreignObject
                x={node.cx + 12}
                y={node.cy - 12}
                width="16"
                height="16"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: node.id * 0.1 + 1 }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {getStatusIcon(node.status)}
                </div>
              </motion.foreignObject>
              
              {/* Animated node label */}
              <motion.text
                x={node.cx}
                y={node.cy + 35}
                textAnchor="middle"
                className="text-xs font-semibold fill-current"
                style={{ fill: nodeColor }}
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ 
                  opacity: [0.5, 1, 0.5], 
                  y: [15, 0, 15], 
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: node.id * 0.1 + 1 
                }}
              >
                {node.label}
              </motion.text>

              {/* Hover tooltip with description */}
              {isHovered && (
                <motion.foreignObject
                  x={node.cx + 20}
                  y={node.cy - 20}
                  width="120"
                  height="60"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-slate-800 text-white p-2 rounded-lg text-xs shadow-xl border border-slate-700">
                    <div className="font-semibold mb-1">{node.label}</div>
                    <div className="text-slate-300">{node.description}</div>
                    <div className="flex items-center mt-1">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        node.status === 'active' ? 'bg-green-400' :
                        node.status === 'idle' ? 'bg-yellow-400' :
                        'bg-gray-400'
                      }`} />
                      <span className="text-slate-400 capitalize">{node.status}</span>
                    </div>
                  </div>
                </motion.foreignObject>
              )}
            </g>
          );
        })}

        {/* Floating energy orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.g key={`orb-${i}`}>
            <motion.circle
              cx={40 + i * 40}
              cy={20 + (i % 2) * 20}
              r="3"
              fill="#F0ABFC"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
                y: [0, -15, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.5 
              }}
            />
          </motion.g>
        ))}

        {/* Central energy field */}
        <motion.circle
          cx="140"
          cy="120"
          r="80"
          fill="none"
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          opacity="0.1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        />

        {/* Data flow indicators */}
        {activeConnections.map((connectionId, index) => {
          const [fromId, toId] = connectionId.split('-').map(Number);
          const fromNode = nodes.find(n => n.id === fromId);
          const toNode = nodes.find(n => n.id === toId);
          
          return (
            <motion.g key={`data-indicator-${index}`}>
              <motion.circle
                cx={fromNode.cx}
                cy={fromNode.cy}
                r="8"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

export default AnimatedNetwork; 