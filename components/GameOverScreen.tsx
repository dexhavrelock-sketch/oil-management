import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
      <h1 className="text-6xl md:text-8xl font-bold text-red-500 mb-4">Game Over</h1>
      <p className="text-3xl md:text-4xl text-gray-200 mb-2">Your Final Earnings:</p>
      <p className="text-7xl font-bold text-yellow-400 mb-10">${(score / 100).toFixed(2)}</p>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOverScreen;