'use client';

import React from 'react';
import { formatSeconds } from '@/utils/formatters';

interface TimerProps {
  seconds: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Timer: React.FC<TimerProps> = ({
  seconds,
  isRunning,
  onStart,
  onPause,
  onReset,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className={`font-mono font-bold ${sizeStyles[size]} text-blue-600`}>
        {formatSeconds(seconds)}
      </div>
      <div className='flex gap-2'>
        {!isRunning ? (
          <button
            onClick={onStart}
            className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
          >
            Başla
          </button>
        ) : (
          <button
            onClick={onPause}
            className='bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors'
          >
            Duraklat
          </button>
        )}
        <button
          onClick={onReset}
          className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors'
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
};

export default Timer;
