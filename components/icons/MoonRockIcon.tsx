import React from 'react';

export const MoonRockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
    style={{ filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))' }}
  >
    <defs>
      <radialGradient id="moonRockGradient" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#e0e0e0" />
        <stop offset="80%" stopColor="#a0a0a0" />
        <stop offset="100%" stopColor="#808080" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#moonRockGradient)" />
    <circle cx="30" cy="35" r="8" fill="#6b7280" opacity="0.6" />
    <circle cx="65" cy="60" r="12" fill="#6b7280" opacity="0.5" />
    <circle cx="70" cy="25" r="5" fill="#6b7280" opacity="0.7" />
    <circle cx="45" cy="70" r="6" fill="#6b7280" opacity="0.6" />
  </svg>
);