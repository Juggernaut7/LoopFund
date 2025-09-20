#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting LoopFund Revolutionary Design System Demo...\n');

// Start the development server
const startServer = exec('npm run dev', {
  cwd: path.join(__dirname),
  stdio: 'inherit'
});

startServer.on('error', (error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});

startServer.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(1);
  }
});

// Show instructions after a short delay
setTimeout(() => {
  console.log('\n🎨 LoopFund Revolutionary Design System Demo');
  console.log('==========================================');
  console.log('✅ Server is running!');
  console.log('🌐 Open your browser and navigate to:');
  console.log('   http://localhost:5173/design-system');
  console.log('\n🎯 What you\'ll see:');
  console.log('   • Revolutionary color palette (no blue/purple clichés)');
  console.log('   • Unique component designs (pill buttons, floating cards)');
  console.log('   • Maximum animation impact (scroll reveals, micro-interactions)');
  console.log('   • Distinctive typography (Space Grotesk + Inter)');
  console.log('   • Interactive form elements with floating labels');
  console.log('   • Animated counters and data visualizations');
  console.log('\n💡 This design system breaks away from generic fintech aesthetics');
  console.log('   and showcases cutting-edge frontend mastery!');
  console.log('\n🔄 Press Ctrl+C to stop the server');
}, 2000);
