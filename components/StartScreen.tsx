import React, { useState, useEffect } from 'react';
import { OilDropIcon } from './icons/OilDropIcon';
import { HIGH_SCORE_KEY } from '../constants';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="flex items-center gap-4 mb-4">
        <OilDropIcon className="w-16 h-16 text-yellow-300" />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
          Oil Collector
        </h1>
      </div>
      <p className="text-lg md:text-xl text-gray-300 max-w-md mb-8">
        Click the oil drops to collect cash. How much can you earn in this endless challenge?
      </p>
      {highScore > 0 && (
        <div className="mb-8 animate-fade-in">
          <p className="text-xl text-gray-400">High Score</p>
          <p className="text-4xl font-bold text-yellow-300">${(highScore / 100).toFixed(2)}</p>
        </div>
      )}
      <button
        onClick={onStart}
        className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;