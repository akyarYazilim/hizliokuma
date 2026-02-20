'use client';

import React from 'react';
import { Exercise } from '@/types';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EXERCISE_CATEGORIES, DIFFICULTY_LEVELS } from '@/constants/exercises';
import Link from 'next/link';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelectExercise?: (exerciseId: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onSelectExercise 
}) => {
  const categoryLabel = EXERCISE_CATEGORIES[exercise.category as keyof typeof EXERCISE_CATEGORIES];
  const difficultyLabel = DIFFICULTY_LEVELS[exercise.difficulty as keyof typeof DIFFICULTY_LEVELS];

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <Card className='h-full hover:shadow-lg transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <span className='text-4xl'>{exercise.icon}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[exercise.difficulty]}`}>
          {difficultyLabel}
        </span>
      </div>

      <CardHeader title={exercise.title} subtitle={categoryLabel} />
      
      <CardBody>
        <p className='text-gray-600 text-sm'>{exercise.description}</p>
        <div className='mt-4 text-sm text-gray-500'>
          ⏱️ {exercise.duration} saniye
        </div>
      </CardBody>

      <CardFooter>
        <Link href={`/exercises/${exercise.id}`} className='flex-1'>
          <Button 
            variant='primary' 
            className='w-full'
            onClick={() => onSelectExercise?.(exercise.id)}
          >
            Başla
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ExerciseCard;
