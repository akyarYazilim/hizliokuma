'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  size = 'md',
}) => {
  const heightStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className='w-full'>
      {(label || showPercentage) && (
        <div className='flex justify-between items-center mb-2'>
          {label && <span className='text-sm font-medium text-gray-700'>{label}</span>}
          {showPercentage && (
            <span className='text-sm font-medium text-gray-600'>{clampedProgress}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div
          className='bg-blue-600 h-full rounded-full transition-all duration-300 ease-out'
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
