import React from 'react';

export const GasStationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M4 7v10h12v-4a2 2 0 00-2-2h-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
    <path d="M9 7v10" />
    <path d="M18 7h2a2 2 0 012 2v4" />
    <path d="M22 15v1a2 2 0 01-2 2h-2" />
  </svg>
);