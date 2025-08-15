import React from 'react';
import logoImage from '../../assets/logo.jpg';

const FaviconLogo = ({ size = 32, className = '' }) => {
  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-sm border border-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={logoImage} 
        alt="LoopFund" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default FaviconLogo;
