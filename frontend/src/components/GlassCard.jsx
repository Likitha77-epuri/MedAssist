import React from 'react';

const GlassCard = ({ children, className = '', hover = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 glass-card ${
        hover ? 'hover:translate-y-[-2px] transition-transform duration-300' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
