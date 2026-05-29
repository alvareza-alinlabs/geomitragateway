import React from 'react';

export const RegularCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0A192F] border border-[#1E2D3D] rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);
