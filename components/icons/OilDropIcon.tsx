
import React from 'react';

export const OilDropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
    style={{ filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))' }}
  >
    <defs>
      <radialGradient id="oilGradient" cx="0.3" cy="0.2" r="0.7">
        <stop offset="0%" stopColor="#4d4d4d" />
        <stop offset="60%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>
    </defs>
    <path 
      d="M50 0 C25 0, 0 25, 0 50 C0 85, 50 100, 50 100 C50 100, 100 85, 100 50 C100 25, 75 0, 50 0 Z" 
      transform="rotate(180 50 50)"
      fill="url(#oilGradient)"
    />
    <path 
      d="M65,20 A15,10 0,0,0 50,30 A15,10 0,0,0 65,40 A15,10 0,0,0 80,30 A15,10 0,0,0 65,20"
      fill="white"
      fillOpacity="0.3"
      transform="rotate(-20 65 30)"
    />
  </svg>
);
