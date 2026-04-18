import { useState, useEffect, useRef, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_DECREMENT = 2; // Milliseconds to subtract per food eaten
const MIN_SPEED = 60;

const getRandomPoint = (): Point => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 15 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const currentDir = useRef<Point>({ x: 0, y: -1 }); // initial UP
  const lockedDir = useRef<Point>({ x: 0, y: -1 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Need active game to prevent arrow scrolling
      if (isPlaying && !gameOver) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
          e.preventDefault();
        }
      }

      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        if (lockedDir.current.y !== 1) currentDir.current = { x: 0, y: -1 };
      }
      if (key === 'arrowdown' || key === 's') {
        if (lockedDir.current.y !== -1) currentDir.current = { x: 0, y: 1 };
      }
      if (key === 'arrowleft' || key === 'a') {
        if (lockedDir.current.x !== 1) currentDir.current = { x: -1, y: 0 };
      }
      if (key === 'arrowright' || key === 'd') {
        if (lockedDir.current.x !== -1) currentDir.current = { x: 1, y: 0 };
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  const tick = useCallback(() => {
    setSnake((prev) => {
      const head = prev[0];
      const nextHead = {
        x: head.x + currentDir.current.x,
        y: head.y + currentDir.current.y,
      };

      // Collision detection (walls or self)
      if (
        nextHead.x < 0 ||
        nextHead.x >= GRID_SIZE ||
        nextHead.y < 0 ||
        nextHead.y >= GRID_SIZE ||
        prev.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y)
      ) {
        setGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return prev;
      }

      const newSnake = [nextHead, ...prev];

      // Food check
      if (nextHead.x === food.x && nextHead.y === food.y) {
        setScore((s) => s + 10);
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        
        let newFood = getRandomPoint();
        while (newSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)) {
          newFood = getRandomPoint();
        }
        setFood(newFood);
      } else {
        newSnake.pop();
      }

      lockedDir.current = currentDir.current;
      return newSnake;
    });
  }, [food, score, highScore]);

  useInterval(tick, isPlaying && !gameOver ? speed : null);

  const startGame = () => {
    setSnake([{ x: 10, y: 15 }]);
    currentDir.current = { x: 0, y: -1 };
    lockedDir.current = { x: 0, y: -1 };
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setFood(getRandomPoint());
    setIsPlaying(true);
  };

  // Build grid blocks
  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = !isSnakeHead && snake.some((seg) => seg.x === x && seg.y === y);
        const isFood = food.x === x && food.y === y;

        let cellClass = "w-full h-full rounded-[2px] transition-colors duration-75";
        
        if (isSnakeHead) {
          cellClass += " bg-white shadow-[0_0_10px_#fff]";
        } else if (isSnakeBody) {
          cellClass += " bg-cyan-400 shadow-[0_0_8px_#22d3ee] rounded-[4px]";
        } else if (isFood) {
          cellClass += " bg-pink-500 rounded-full shadow-[0_0_12px_#ec4899] animate-pulse";
        } else {
          cellClass += " bg-zinc-900/30 border border-zinc-800/10";
        }

        grid.push(
          <div key={`${x}-${y}`} className="w-full h-full flex items-center justify-center p-[1px]">
            <div className={cellClass} />
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="flex flex-col items-center">
      
      {/* Score Header */}
      <div className="w-full max-w-[400px] flex justify-between items-end mb-4 px-2">
        <div className="flex flex-col text-left">
          <span className="text-sm font-mono text-cyan-500 uppercase tracking-wide">Score</span>
          <span className="text-3xl font-bold text-white text-glow-cyan leading-none">{score}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-mono text-zinc-500 uppercase tracking-wide">High Record</span>
          <span className="text-xl font-bold text-zinc-300 leading-none">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div 
          className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-black border-2 border-cyan-500/50 rounded-xl box-glow-cyan overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {renderGrid()}
        </div>

        {/* Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-xl">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xl rounded-full shadow-[0_0_20px_#22d3ee] transition-transform transform hover:scale-105 active:scale-95"
            >
              INITIALIZE
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-xl">
            <div className="text-pink-500 text-4xl mb-2 font-bold text-glow-pink">SYSTEM FAILURE</div>
            <div className="text-zinc-300 mb-6 font-mono">Final Score: {score}</div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold text-xl rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all transform hover:scale-105 active:scale-95"
            >
              REBOOT
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
