
import React from 'react';

const GeneratingScreen: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-64">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      <h2 className="text-3xl font-bold mt-6 text-gray-300">Consulting the Stars...</h2>
      <p className="text-lg text-gray-400 mt-2">Your personalized fortune is being crafted.</p>
    </div>
  );
};

export default GeneratingScreen;
