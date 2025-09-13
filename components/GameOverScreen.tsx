
import React from 'react';

interface GameOverScreenProps {
  onTryAgain: () => void;
  onNewFortune: () => void;
  message?: string;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onTryAgain, onNewFortune, message = "Oh no, your luck ran out!" }) => {
  return (
    <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl animate-fade-in">
      <h2 className="text-5xl font-bold mb-4 text-red-500">Game Over</h2>
      <p className="text-xl text-gray-300 mb-8">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onTryAgain}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Try Again
        </button>
        <button
          onClick={onNewFortune}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400"
        >
          New Fortune
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
