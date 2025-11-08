import React, { useState, useCallback } from 'react';
import { GameState } from './types';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);

  const startGame = useCallback(() => {
    setGameState(GameState.Playing);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return <GameScreen />;
      case GameState.Start:
      default:
        return <StartScreen onStart={startGame} />;
    }
  };

  return (
    <main className="w-screen h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans overflow-hidden">
      {renderContent()}
    </main>
  );
};

export default App;
