
import React from 'react';
import type { FortuneData, FortuneImages } from '../types';

interface ResultScreenProps {
  fortune: FortuneData;
  images: FortuneImages;
  onPlayAgain: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ fortune, images, onPlayAgain }) => {
  return (
    <div className="text-center p-6 bg-gray-800 rounded-xl shadow-2xl animate-fade-in">
      <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500">
        Your Fortune is Revealed!
      </h2>
      
      <div className="grid grid-cols-2 gap-2 my-6 max-w-lg mx-auto border-4 border-yellow-400 rounded-lg overflow-hidden">
        <img src={`data:image/jpeg;base64,${images.meal}`} alt="Fortune Meal" className="w-full h-full object-cover" />
        <img src={`data:image/jpeg;base64,${images.color}`} alt="Fortune Color" className="w-full h-full object-cover" />
        <img src={`data:image/jpeg;base64,${images.number}`} alt="Fortune Number" className="w-full h-full object-cover" />
        <img src={`data:image/jpeg;base64,${images.proverb}`} alt="Fortune Proverb" className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="font-semibold text-purple-300">Lucky Meal:</p>
          <p className="text-lg">{fortune.meal}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="font-semibold text-teal-300">Lucky Color:</p>
          <p className="text-lg">{fortune.color}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="font-semibold text-green-300">Lucky Number:</p>
          <p className="text-lg">{fortune.number}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="font-semibold text-orange-300">Today's Proverb:</p>
          <p className="text-lg italic">"{fortune.proverb}"</p>
        </div>
      </div>
      
      <button
        onClick={onPlayAgain}
        className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        Get a New Fortune
      </button>
    </div>
  );
};

export default ResultScreen;
