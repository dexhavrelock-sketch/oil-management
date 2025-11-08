import React from 'react';

export const PlasticIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V7s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="11" x2="4" y2="21" />
    <line x1="12" y1="11" x2="12" y2="21" />
    <line x1="20" y1="11" x2="20" y2="21" />
  </svg>
);
