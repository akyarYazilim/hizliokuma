'use client';

import React, { useState, useEffect } from 'react';
import { PeripheralVisionExercise as PeripheralVisionExerciseType } from '@/types';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';
import Timer from '@/components/common/Timer';

interface PeripheralVisionProps {
  exercise: PeripheralVisionExerciseType;
  onComplete: (results: { score: number; targetFound: number; totalRounds: number }) => void;
}

export const PeripheralVisionExercise: React.FC<PeripheralVisionProps> = ({
  exercise,
  onComplete,
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [grid, setGrid] = useState<boolean[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeRemaining === 0 && isRunning) {
      handleComplete();
    }
  }, [isRunning, timeRemaining]);

  const generateGrid = () => {
    const size = exercise.gridSize * exercise.gridSize;
    const newGrid = new Array(size).fill(false);
    const targetIndices = new Set<number>();
    
    while (targetIndices.size < Math.min(exercise.targetCount, size)) {
      targetIndices.add(Math.floor(Math.random() * size));
    }
    
    targetIndices.forEach(idx => {
      newGrid[idx] = true;
    });
    
    return newGrid;
  };

  const handleStart = () => {
    setIsStarted(true);
    setIsRunning(true);
    generateAndShowNewRound();
  };

  const generateAndShowNewRound = () => {
    const newGrid = generateGrid();
    setGrid(newGrid);
    setShowGrid(true);
    setFoundCount(0);
    setRoundCount(prev => prev + 1);

    setTimeout(() => {
      setShowGrid(false);
    }, exercise.displayDuration);
  };

  const handleCellClick = (index: number) => {
    if (!showGrid && grid[index] && !grid[index]) return; // Only count during display
    
    if (grid[index]) {
      setFoundCount(prev => prev + 1);
      setScore(prev => prev + 10);
      const newGrid = [...grid];
      newGrid[index] = false;
      setGrid(newGrid);
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    onComplete({
      score,
      targetFound: foundCount,
      totalRounds: roundCount,
    });
  };

  if (!isStarted) {
    return (
      <Card>
        <CardHeader 
          title={exercise.title}
          subtitle={exercise.description}
        />
        <CardBody>
          <p className='text-gray-700 mb-4'>
            Çevre görüşü antrenmanı, periferik vizyonunuzu geliştirmeye yardımcı olur.
          </p>
          <ul className='list-disc list-inside text-gray-600 space-y-2'>
            <li>Grid'de hedef hücreleri hatırlamaya çalışın</li>
            <li>{exercise.gridSize}x{exercise.gridSize} kafes gösterilecek</li>
            <li>Her turda {exercise.targetCount} hedef hücre olacak</li>
            <li>Hücreleri tıklayarak bulduğunuzu gösterin</li>
          </ul>
        </CardBody>
        <CardFooter>
          <Button 
            variant='primary' 
            className='ml-auto'
            onClick={handleStart}
          >
            Başla
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title={exercise.title}
        subtitle={`Tur ${roundCount}`}
      />
      
      <CardBody>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div>
            <p className='text-sm text-gray-600'>Skor</p>
            <p className='text-2xl font-bold text-blue-600'>{score}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Bulunan Hedefler</p>
            <p className='text-2xl font-bold text-green-600'>{foundCount}</p>
          </div>
        </div>

        <ProgressBar progress={(timeRemaining / exercise.duration) * 100} label='Zaman' />

        <div className={`mt-8 p-6 rounded-lg ${showGrid ? 'bg-gray-50' : 'bg-gray-100'}`}>
          <div 
            className='inline-block gap-1'
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${exercise.gridSize}, minmax(0, 1fr))`,
              gap: '8px',
            }}
          >
            {grid.map((isTarget, idx) => (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={!showGrid}
                className={`w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all ${
                  showGrid && isTarget
                    ? 'bg-green-500 border-green-600 text-white'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                } disabled:cursor-not-allowed`}
              >
                {showGrid && isTarget ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className='mt-8'>
          <Timer
            seconds={timeRemaining}
            isRunning={isRunning}
            onStart={() => setIsRunning(true)}
            onPause={() => setIsRunning(false)}
            onReset={() => {
              setTimeRemaining(exercise.duration);
              setScore(0);
              setRoundCount(0);
              setIsStarted(false);
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default PeripheralVisionExercise;
