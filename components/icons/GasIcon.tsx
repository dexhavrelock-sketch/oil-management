import React from 'react';

export const GasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M8.28 2.22a.5.5 0 00-.56 0l-5 5A.5.5 0 003 8.02V18a2 2 0 002 2h14a2 2 0 002-2V8.02a.5.5 0 00-.28-.44l-5-5a.5.5 0 00-.56 0z" />
    <path d="M12 12v6" />
    <path d="M16 18H8" />
  </svg>
);