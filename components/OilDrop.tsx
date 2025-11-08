
import React from 'react';
import type { OilDropType } from '../types';
import { OilDropIcon } from './icons/OilDropIcon';
import { MoonRockIcon } from './icons/MoonRockIcon';
import { OIL_DROP_LIFESPAN_MS } from '../constants';

interface OilDropProps {
  drop: OilDropType;
  onCollect: (id: number, size: number) => void;
  isOutageActive: boolean;
  isWarActive: boolean;
  isMoonRunActive: boolean;
}

const OilDrop: React.FC<OilDropProps> = ({ drop, onCollect, isOutageActive, isWarActive, isMoonRunActive }) => {
  const { id, x, y, size } = drop;

  const animationDuration = OIL_DROP_LIFESPAN_MS / 1000;
  
  const getGlowClass = () => {
    if (isMoonRunActive) return "animate-moon-glow";
    if (isWarActive && isOutageActive) return "animate-chaos-glow";
    if (isWarActive) return "animate-war-glow";
    if (isOutageActive) return "animate-golden-glow";
    return "";
  };

  const classes = [
    "absolute",
    "cursor-pointer",
    "transform",
    "transition-transform",
    "duration-200",
    "hover:scale-110",
    "animate-fade-in-out",
    getGlowClass()
  ].filter(Boolean).join(" ");

  const IconComponent = isMoonRunActive ? MoonRockIcon : OilDropIcon;
  const iconColorClass = isMoonRunActive ? "text-gray-400" : "text-black";

  return (
    <button
      onClick={() => onCollect(id, size)}
      className={`${classes} ${iconColorClass}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${animationDuration}s`,
      }}
      aria-label="Collect oil drop"
    >
      <IconComponent className="w-full h-full" />
    </button>
  );
};

export default React.memo(OilDrop);