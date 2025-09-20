import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const LoopFundInput = forwardRef(({
  className,
  type = 'text',
  label,
  placeholder,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  rightIcon,
  onRightIconClick,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  
  const baseClasses = "w-full px-4 py-3 border-2 border-loopfund-neutral-300 rounded-xl bg-loopfund-neutral-50 text-loopfund-neutral-800 placeholder-loopfund-neutral-400 transition-all duration-300 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const stateClasses = {
    default: "border-loopfund-neutral-300 focus:border-loopfund-emerald-500 focus:shadow-glow-focus",
    error: "border-loopfund-coral-500 focus:border-loopfund-coral-500 focus:shadow-glow-coral",
    success: "border-loopfund-emerald-500 focus:border-loopfund-emerald-500 focus:shadow-glow-emerald"
  };
  
  const getState = () => {
    if (error) return 'error';
    if (success) return 'success';
    return 'default';
  };
  
  const inputClasses = cn(
    baseClasses,
    stateClasses[getState()],
    icon && iconPosition === 'left' && 'pl-12',
    (icon && iconPosition === 'right') || rightIcon ? 'pr-12' : '',
    className
  );
  
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };
  
  const showLabel = isFocused || hasValue;
  
  return (
    <div className="relative">
      {/* Floating Label */}
      <motion.label
        className={cn(
          "absolute left-4 transition-all duration-300 pointer-events-none",
          showLabel 
            ? "top-2 text-xs font-medium text-loopfund-emerald-500" 
            : "top-3 text-base text-loopfund-neutral-400"
        )}
        animate={{
          y: showLabel ? -8 : 0,
          scale: showLabel ? 0.85 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label}
        {required && <span className="text-loopfund-coral-500 ml-1">*</span>}
      </motion.label>
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-loopfund-neutral-400">
            {icon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={showLabel ? placeholder : ''}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          {...props}
        />
        
        {/* Right Icon */}
        {(icon && iconPosition === 'right') || rightIcon ? (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-loopfund-neutral-400">
            {rightIcon ? (
              <button
                type="button"
                onClick={onRightIconClick}
                className="hover:text-loopfund-neutral-600 transition-colors"
              >
                {rightIcon}
              </button>
            ) : (
              icon
            )}
          </div>
        ) : null}
        
        {/* Success Checkmark */}
        {success && (
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          >
            <svg
              className="w-5 h-5 text-loopfund-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </svg>
          </motion.div>
        )}
      </div>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4 text-loopfund-coral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-loopfund-coral-500">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4 text-loopfund-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-loopfund-emerald-500">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

LoopFundInput.displayName = "LoopFundInput";

export default LoopFundInput;
