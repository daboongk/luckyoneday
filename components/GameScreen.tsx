import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { FortuneImages } from '../types';

// Game constants
const GAME_DURATION = 60; // in seconds
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;
const CURSOR_SIZE = 20;

// Obstacle constants
const OBSTACLE_COUNT = 10;
const MIN_OBSTACLE_SIZE = 20;
const MAX_OBSTACLE_SIZE = 40;
const MIN_OBSTACLE_SPEED = 1;
const MAX_OBSTACLE_SPEED = 2.5;

interface GameScreenProps {
  images: FortuneImages;
  onGameWin: () => void;
  onGameOver: () => void;
}

interface Obstacle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ images, onGameWin, onGameOver }) => {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const obstacleCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // FIX: Initialize useRef with an explicit null value to resolve "Expected 1 arguments, but got 0" error in some environments.
  const animationFrameId = useRef<number | null>(null);
  const obstacles = useRef<Obstacle[]>([]);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
  // FIX: Explicitly specify the type for the Set to avoid potential type inference issues.
  const revealedPixels = useRef(new Set<string>());
  const isGameOver = useRef(false);

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [progress, setProgress] = useState(0);

  const totalPixels = Math.floor((CANVAS_WIDTH * CANVAS_HEIGHT) / (CURSOR_SIZE * CURSOR_SIZE));

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isGameOver.current) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastMousePosition.current = { x, y };

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(x - CURSOR_SIZE / 2, y - CURSOR_SIZE / 2, CURSOR_SIZE, CURSOR_SIZE);
      
      const gridX = Math.floor(x / CURSOR_SIZE);
      const gridY = Math.floor(y / CURSOR_SIZE);
      const key = `${gridX},${gridY}`;
      
      if (!revealedPixels.current.has(key)) {
        revealedPixels.current.add(key);
        const newProgress = Math.min(100, (revealedPixels.current.size / totalPixels) * 100);
        setProgress(newProgress);
        if (newProgress >= 100) {
          onGameWin();
        }
      }
    }
  }, [onGameWin, totalPixels]);
  
  useEffect(() => {
    const handleGameOver = () => {
        if (!isGameOver.current) {
            isGameOver.current = true;
            onGameOver();
        }
    };
    
    // --- Game Initialization ---
    isGameOver.current = false;
    revealedPixels.current.clear();
    setProgress(0);
    setTimeLeft(GAME_DURATION);

    // 1. Initialize obstacles with varied sizes and speeds
    obstacles.current = [];
    for (let i = 0; i < OBSTACLE_COUNT; i++) {
        const size = Math.random() * (MAX_OBSTACLE_SIZE - MIN_OBSTACLE_SIZE) + MIN_OBSTACLE_SIZE;
        const speed = Math.random() * (MAX_OBSTACLE_SPEED - MIN_OBSTACLE_SPEED) + MIN_OBSTACLE_SPEED;
        const angle = Math.random() * 2 * Math.PI;
        obstacles.current.push({
            size,
            x: Math.random() * (CANVAS_WIDTH - size),
            y: Math.random() * (CANVAS_HEIGHT - size),
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
        });
    }

    // 2. Draw the main image canvas (bottom layer, z-0)
    const imageCanvas = imageCanvasRef.current;
    const imageCtx = imageCanvas?.getContext('2d');
    if (imageCtx) {
        const imageElements: { [key: string]: HTMLImageElement } = {};
        let loadedImages = 0;
        const imageKeys = ['meal', 'color', 'number', 'proverb'];
        
        const drawImages = () => {
            const halfWidth = CANVAS_WIDTH / 2;
            const halfHeight = CANVAS_HEIGHT / 2;
            imageCtx.drawImage(imageElements.meal, 0, 0, halfWidth, halfHeight);
            imageCtx.drawImage(imageElements.color, halfWidth, 0, halfWidth, halfHeight);
            imageCtx.drawImage(imageElements.number, 0, halfHeight, halfWidth, halfHeight);
            imageCtx.drawImage(imageElements.proverb, halfWidth, halfHeight, halfWidth, halfHeight);
        };

        imageKeys.forEach(key => {
            const img = new Image();
            img.src = `data:image/jpeg;base64,${images[key as keyof FortuneImages]}`;
            img.onload = () => {
                imageElements[key] = img;
                loadedImages++;
                if (loadedImages === imageKeys.length) {
                    drawImages();
                }
            };
        });
    }

    // 3. Draw the mask canvas (middle layer, z-10)
    const maskCanvas = maskCanvasRef.current;
    const maskCtx = maskCanvas?.getContext('2d');
    if (maskCtx) {
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // --- Game Loop ---
    const gameLoop = () => {
        if (isGameOver.current) {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            return;
        }

        const obstacleCtx = obstacleCanvasRef.current?.getContext('2d');
        if (!obstacleCtx) return;

        obstacleCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw custom cursor first so obstacles appear on top
        if (lastMousePosition.current) {
            const mouse = lastMousePosition.current;

            // Glow effect
            obstacleCtx.shadowColor = '#00FFFF';
            obstacleCtx.shadowBlur = 10;
            
            // Inner circle
            obstacleCtx.beginPath();
            obstacleCtx.arc(mouse.x, mouse.y, CURSOR_SIZE / 2, 0, 2 * Math.PI);
            obstacleCtx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            obstacleCtx.fill();

            // Border
            obstacleCtx.strokeStyle = '#00FFFF';
            obstacleCtx.lineWidth = 3;
            obstacleCtx.stroke();
            
            // Reset shadow for obstacles
            obstacleCtx.shadowBlur = 0;
            obstacleCtx.shadowColor = 'transparent';
        }

        obstacleCtx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        
        // Obstacle-obstacle collision
        for (let i = 0; i < obstacles.current.length; i++) {
            for (let j = i + 1; j < obstacles.current.length; j++) {
                const obs1 = obstacles.current[i];
                const obs2 = obstacles.current[j];
                if (obs1.x < obs2.x + obs2.size && obs1.x + obs1.size > obs2.x &&
                    obs1.y < obs2.y + obs2.size && obs1.y + obs1.size > obs2.y) {
                    const tempDx = obs1.dx;
                    const tempDy = obs1.dy;
                    obs1.dx = obs2.dx;
                    obs1.dy = obs2.dy;
                    obs2.dx = tempDx;
                    obs2.dy = tempDy;
                }
            }
        }

        obstacles.current.forEach(obs => {
          if (obs.x + obs.dx <= 0 || obs.x + obs.dx >= CANVAS_WIDTH - obs.size) obs.dx *= -1;
          if (obs.y + obs.dy <= 0 || obs.y + obs.dy >= CANVAS_HEIGHT - obs.size) obs.dy *= -1;
          obs.x += obs.dx;
          obs.y += obs.dy;
          obstacleCtx.fillRect(obs.x, obs.y, obs.size, obs.size);

          if (lastMousePosition.current) {
            const mouse = lastMousePosition.current;
            const cursorRect = { x: mouse.x - CURSOR_SIZE / 2, y: mouse.y - CURSOR_SIZE / 2, size: CURSOR_SIZE };
            if (cursorRect.x < obs.x + obs.size && cursorRect.x + cursorRect.size > obs.x &&
                cursorRect.y < obs.y + obs.size && cursorRect.y + cursorRect.size > obs.y) {
              handleGameOver();
            }
          }
        });

        animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoop(); // Start rendering loop

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      clearInterval(timer);
    };
  }, [images, onGameOver, onGameWin]);
  
  return (
    <div className="flex flex-col items-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Reveal Your Fortune!</h2>
        <div className="flex justify-between w-full max-w-[512px] mb-2 text-lg">
            <span>Time Left: <span className="font-bold text-yellow-400">{timeLeft}s</span></span>
            <span>Progress: <span className="font-bold text-green-400">{progress.toFixed(0)}%</span></span>
        </div>
        <div className="relative w-[512px] h-[512px] bg-gray-700 rounded-lg shadow-lg overflow-hidden">
            <canvas ref={imageCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="absolute top-0 left-0 z-0" />
            <canvas ref={maskCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="absolute top-0 left-0 z-10" />
            <canvas 
              ref={obstacleCanvasRef} 
              width={CANVAS_WIDTH} 
              height={CANVAS_HEIGHT} 
              onMouseMove={handleMouseMove} 
              className="absolute top-0 left-0 z-20 cursor-none" 
            />
        </div>
        <p className="mt-4 text-gray-400">Move your mouse to clear the board. Avoid the moving obstacles!</p>
    </div>
  );
};

export default GameScreen;