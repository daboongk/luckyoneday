
import React, { useState, useCallback } from 'react';
import { GameState, UserInfo, FortuneData, FortuneImages } from './types';
import { generateFortune, generateImages } from './services/geminiService';

import StartScreen from './components/StartScreen';
import InputScreen from './components/InputScreen';
import GeneratingScreen from './components/GeneratingScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import GameOverScreen from './components/GameOverScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [fortuneData, setFortuneData] = useState<FortuneData | null>(null);
  const [fortuneImages, setFortuneImages] = useState<FortuneImages | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateFortune = useCallback(async (info: UserInfo) => {
    setUserInfo(info);
    setGameState('generating');
    setError(null);
    try {
      const fortune = await generateFortune(info);
      setFortuneData(fortune);
      
      const images = await generateImages(fortune.imagePrompts);
      setFortuneImages(images);
      
      setGameState('game');
    } catch (err) {
      console.error(err);
      setError('Failed to generate your fortune. Please try again.');
      setGameState('input');
    }
  }, []);

  const handleGameWin = useCallback(() => {
    setGameState('result');
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('gameover');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setUserInfo(null);
    setFortuneData(null);
    setFortuneImages(null);
    setGameState('input');
  }, []);
  
  const handleTryAgain = useCallback(() => {
    setGameState('game');
  }, []);


  const renderScreen = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={() => setGameState('input')} />;
      case 'input':
        return <InputScreen onGenerate={handleGenerateFortune} error={error} />;
      case 'generating':
        return <GeneratingScreen />;
      case 'game':
        if (fortuneImages) {
          return <GameScreen images={fortuneImages} onGameWin={handleGameWin} onGameOver={handleGameOver} />;
        }
        // Fallback if images are not ready
        return <GeneratingScreen />;
      case 'result':
        if (fortuneData && fortuneImages) {
          return <ResultScreen fortune={fortuneData} images={fortuneImages} onPlayAgain={handlePlayAgain} />;
        }
        return <GameOverScreen onTryAgain={handleTryAgain} onNewFortune={handlePlayAgain} message="An unexpected error occurred." />;
      case 'gameover':
        return <GameOverScreen onTryAgain={handleTryAgain} onNewFortune={handlePlayAgain} />;
      default:
        return <StartScreen onStart={() => setGameState('input')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
