import React from 'react';
import { motion } from 'framer-motion';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundCard, { 
  LoopFundCardHeader, 
  LoopFundCardTitle, 
  LoopFundCardDescription, 
  LoopFundCardContent, 
  LoopFundCardFooter 
} from '../components/ui/LoopFundCard';
import LoopFundInput from '../components/ui/LoopFundInput';
import AnimatedSection from '../components/animations/AnimatedSection';
import StaggeredList from '../components/animations/StaggeredList';
import AnimatedCounter from '../components/animations/AnimatedCounter';

const DesignSystemDemo = () => {
  return (
    <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Mesh Background */}
        <div className="absolute inset-0 loopfund-mesh-bg opacity-50" />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <AnimatedSection animation="fadeInUp" delay={200}>
            <h1 className="font-display text-display-2xl text-loopfund-midnight-900 dark:text-loopfund-dark-text mb-6">
              LoopFund Revolutionary Design System
            </h1>
            <p className="font-body text-body-xl text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8 max-w-3xl mx-auto">
              Breaking away from generic fintech clichés with unique colors, distinctive typography, and maximum animation impact.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <LoopFundButton variant="primary" size="lg">
                Get Started
              </LoopFundButton>
              <LoopFundButton variant="secondary" size="lg">
                Learn More
              </LoopFundButton>
              <LoopFundButton variant="ghost" size="lg">
                View Components
              </LoopFundButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fadeInUp">
            <h2 className="font-display text-display-lg text-loopfund-midnight-900 dark:text-loopfund-dark-text text-center mb-12">
              Revolutionary Color Palette
            </h2>
          </AnimatedSection>
          
          <StaggeredList staggerDelay={100} animation="fadeInUp">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Primary Colors */}
              <LoopFundCard variant="standard" hover>
                <LoopFundCardContent>
                  <div className="space-y-4">
                    <div className="h-20 bg-loopfund-emerald-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-display text-h4">Emerald</span>
                    </div>
                    <div>
                      <h3 className="font-display text-h4 text-loopfund-midnight-900 dark:text-loopfund-dark-text">Growth & Prosperity</h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Primary actions, success states</p>
                    </div>
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>

              <LoopFundCard variant="standard" hover>
                <LoopFundCardContent>
                  <div className="space-y-4">
                    <div className="h-20 bg-loopfund-coral-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-display text-h4">Coral</span>
                    </div>
                    <div>
                      <h3 className="font-display text-h4 text-loopfund-midnight-900 dark:text-loopfund-dark-text">Warmth & Trust</h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Human connection, secondary actions</p>
                    </div>
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>

              <LoopFundCard variant="standard" hover>
                <LoopFundCardContent>
                  <div className="space-y-4">
                    <div className="h-20 bg-loopfund-gold-500 rounded-xl flex items-center justify-center">
                      <span className="text-loopfund-midnight-900 font-display text-h4">Gold</span>
                    </div>
                    <div>
                      <h3 className="font-display text-h4 text-loopfund-midnight-900 dark:text-loopfund-dark-text">Success & Achievement</h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Celebrations, highlights</p>
                    </div>
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>

              <LoopFundCard variant="standard" hover>
                <LoopFundCardContent>
                  <div className="space-y-4">
                    <div className="h-20 bg-loopfund-electric-500 rounded-xl flex items-center justify-center">
                      <span className="text-loopfund-midnight-900 font-display text-h4">Electric</span>
                    </div>
                    <div>
                      <h3 className="font-display text-h4 text-loopfund-midnight-900 dark:text-loopfund-dark-text">Innovation & Tech</h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Future-focused elements</p>
                    </div>
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>

              <LoopFundCard variant="standard" hover>
                <LoopFundCardContent>
                  <div className="space-y-4">
                    <div className="h-20 bg-loopfund-mint-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-display text-h4">Mint</span>
                    </div>
                    <div>
                      <h3 className="font-display text-h4 text-loopfund-midnight-900 dark:text-loopfund-dark-text">Fresh Starts</h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">New opportunities</p>
                    </div>
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>

              <LoopFundCard variant="standard" hover>
                <LoopFundCardContent>
                  <div className="space-y-4">
                    <div className="h-20 bg-loopfund-midnight-900 rounded-xl flex items-center justify-center">
                      <span className="text-white font-display text-h4">Midnight</span>
                    </div>
                    <div>
                      <h3 className="font-display text-h4 text-loopfund-midnight-900 dark:text-loopfund-dark-text">Sophistication</h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Premium, depth</p>
                    </div>
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>
            </div>
          </StaggeredList>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-20 px-4 bg-loopfund-neutral-100 dark:bg-loopfund-dark-surface">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fadeInUp">
            <h2 className="font-display text-display-lg text-loopfund-midnight-900 dark:text-loopfund-dark-text text-center mb-12">
              Revolutionary Components
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Buttons */}
            <AnimatedSection animation="fadeInLeft">
              <LoopFundCard variant="elevated">
                <LoopFundCardHeader>
                  <LoopFundCardTitle>Unique Button Styles</LoopFundCardTitle>
                  <LoopFundCardDescription>
                    Beyond rectangles - pill shapes, trapezoids, and neon glows
                  </LoopFundCardDescription>
                </LoopFundCardHeader>
                <LoopFundCardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <LoopFundButton variant="primary" size="sm">Primary</LoopFundButton>
                      <LoopFundButton variant="secondary" size="sm">Secondary</LoopFundButton>
                      <LoopFundButton variant="ghost" size="sm">Ghost</LoopFundButton>
                      <LoopFundButton variant="gold" size="sm">Gold</LoopFundButton>
                      <LoopFundButton variant="pill" size="sm">Pill</LoopFundButton>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <LoopFundButton variant="primary" size="default">Default</LoopFundButton>
                      <LoopFundButton variant="secondary" size="default">Default</LoopFundButton>
                      <LoopFundButton variant="ghost" size="default">Default</LoopFundButton>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <LoopFundButton variant="primary" size="lg">Large</LoopFundButton>
                      <LoopFundButton variant="secondary" size="lg">Large</LoopFundButton>
                      <LoopFundButton variant="ghost" size="lg">Large</LoopFundButton>
                    </div>
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>
            </AnimatedSection>

            {/* Cards */}
            <AnimatedSection animation="fadeInRight">
              <LoopFundCard variant="floating">
                <LoopFundCardHeader>
                  <LoopFundCardTitle>Unique Card Designs</LoopFundCardTitle>
                  <LoopFundCardDescription>
                    Depth, personality, and interactive elements
                  </LoopFundCardDescription>
                </LoopFundCardHeader>
                <LoopFundCardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <LoopFundCard variant="standard" hover>
                        <LoopFundCardContent>
                          <h4 className="font-display text-h5 text-loopfund-midnight-900 dark:text-loopfund-dark-text">Standard</h4>
                          <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">With hover effects</p>
                        </LoopFundCardContent>
                      </LoopFundCard>
                      
                      <LoopFundCard variant="asymmetric">
                        <LoopFundCardContent>
                          <h4 className="font-display text-h5 text-loopfund-midnight-900 dark:text-loopfund-dark-text">Asymmetric</h4>
                          <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Cut corner design</p>
                        </LoopFundCardContent>
                      </LoopFundCard>
                    </div>
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Animation Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fadeInUp">
            <h2 className="font-display text-display-lg text-loopfund-midnight-900 dark:text-loopfund-dark-text text-center mb-12">
              Maximum Animation Impact
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection animation="fadeInUp" delay={200}>
              <LoopFundCard variant="gradient">
                <LoopFundCardContent className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-display text-h3 text-white mb-2">Data Visualization</h3>
                  <p className="font-body text-body text-white/90 mb-4">Animated charts and counters</p>
                  <div className="text-3xl font-mono text-white">
                    <AnimatedCounter end={1250000} prefix="$" format="currency" />
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={400}>
              <LoopFundCard variant="standard" hover>
                <LoopFundCardContent className="text-center">
                  <div className="w-16 h-16 bg-loopfund-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-display text-h3 text-loopfund-midnight-900 dark:text-loopfund-dark-text mb-2">Micro-interactions</h3>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-4">Every detail matters</p>
                  <div className="text-3xl font-mono text-loopfund-emerald-600">
                    <AnimatedCounter end={95} suffix="%" format="percentage" />
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={600}>
              <LoopFundCard variant="glass">
                <LoopFundCardContent className="text-center">
                  <div className="w-16 h-16 bg-loopfund-electric-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-display text-h3 text-loopfund-midnight-900 dark:text-loopfund-dark-text mb-2">Scroll Animations</h3>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-4">Parallax and reveals</p>
                  <div className="text-3xl font-mono text-loopfund-electric-600">
                    <AnimatedCounter end={1000000} format="compact" />
                  </div>
                </LoopFundCardContent>
              </LoopFundCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Form Showcase */}
      <section className="py-20 px-4 bg-loopfund-neutral-100 dark:bg-loopfund-dark-surface">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection animation="fadeInUp">
            <LoopFundCard variant="elevated">
              <LoopFundCardHeader>
                <LoopFundCardTitle>Revolutionary Form Design</LoopFundCardTitle>
                <LoopFundCardDescription>
                  Floating labels, animated validation, and smooth transitions
                </LoopFundCardDescription>
              </LoopFundCardHeader>
              <LoopFundCardContent>
                <div className="space-y-6">
                  <LoopFundInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    type="text"
                    required
                  />
                  
                  <LoopFundInput
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                  
                  <LoopFundInput
                    label="Password"
                    placeholder="Create a password"
                    type="password"
                    success="Password is strong"
                  />
                  
                  <LoopFundInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    error="Passwords do not match"
                  />
                  
                  <div className="pt-4">
                    <LoopFundButton variant="primary" size="lg" className="w-full">
                      Create Account
                    </LoopFundButton>
                  </div>
                </div>
              </LoopFundCardContent>
            </LoopFundCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-loopfund-midnight-900">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection animation="fadeInUp">
            <h3 className="font-display text-h2 text-white mb-4">
              Ready to Revolutionize Your Fintech App?
            </h3>
            <p className="font-body text-body-lg text-loopfund-neutral-400 mb-8 max-w-2xl mx-auto">
              Break away from generic designs and create something truly memorable with LoopFund's revolutionary design system.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <LoopFundButton variant="primary" size="lg">
                Start Building
              </LoopFundButton>
              <LoopFundButton variant="ghost" size="lg">
                View Documentation
              </LoopFundButton>
            </div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  );
};

export default DesignSystemDemo;
