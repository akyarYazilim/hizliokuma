/**
 * useExerciseTimer - Custom hook for managing exercise timer
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseExerciseTimerProps {
  initialTime: number;
  onTimeEnd?: () => void;
  autoStart?: boolean;
}

export function useExerciseTimer({
  initialTime,
  onTimeEnd,
  autoStart = false,
}: UseExerciseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const timerId = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeRemaining, onTimeEnd]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  return {
    timeRemaining,
    isRunning,
    start,
    pause,
    reset,
    progress: ((initialTime - timeRemaining) / initialTime) * 100,
  };
}

export default useExerciseTimer;
