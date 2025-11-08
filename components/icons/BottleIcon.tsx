import React from 'react';

export const BottleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M8 2h8v2H8z" />
    <path d="M10 4h4v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V4h2" />
    <path d="M14 4h2v10a4 4 0 0 1-4 4h-2" />
    <path d="M12 18v4" />
    <path d="M8 22h8" />
  </svg>
);
