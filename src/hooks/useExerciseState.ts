/**
 * useExerciseState - Custom hook for managing exercise state
 */

'use client';

import { useState, useCallback } from 'react';
import { ExerciseState } from '@/types';

interface UseExerciseStateProps {
  totalTime: number;
}

export function useExerciseState({ totalTime }: UseExerciseStateProps) {
  const [state, setState] = useState<ExerciseState>({
    currentIndex: 0,
    isRunning: false,
    score: 0,
    timeRemaining: totalTime,
    totalTime,
  });

  const updateScore = useCallback((points: number) => {
    setState(prev => ({
      ...prev,
      score: prev.score + points,
    }));
  }, []);

  const nextItem = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      isRunning: false,
      score: 0,
      timeRemaining: totalTime,
      totalTime,
    });
  }, [totalTime]);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  return {
    ...state,
    updateScore,
    nextItem,
    reset,
    start,
    pause,
  };
}

export default useExerciseState;
