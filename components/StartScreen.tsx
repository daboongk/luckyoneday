
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        LuckyOneDay
      </h1>
      <p className="text-xl text-gray-300 mb-8">Discover your unique fortune hidden in a puzzle.</p>
      <button
        onClick={onStart}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        Begin Your Journey
      </button>
    </div>
  );
};

export default StartScreen;
