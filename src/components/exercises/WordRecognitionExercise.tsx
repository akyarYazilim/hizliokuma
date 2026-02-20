'use client';

import React, { useState, useEffect } from 'react';
import { WordRecognitionExercise as WordRecognitionExerciseType } from '@/types';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';
import { exerciseService } from '@/services/ExerciseService';

interface WordRecognitionProps {
  exercise: WordRecognitionExerciseType;
  onComplete: (results: { score: number; accuracy: number; roundsCompleted: number }) => void;
}

export const WordRecognitionExerciseComponent: React.FC<WordRecognitionProps> = ({
  exercise,
  onComplete,
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);

  useEffect(() => {
    if (isStarted && currentRound === 0) {
      loadNewRound();
    }
  }, [isStarted]);

  const loadNewRound = () => {
    const shuffledChoices = exerciseService.shuffleArray([...exercise.words]);
    const selectedChoices = shuffledChoices.slice(0, exercise.numberOfChoices - 1);
    
    if (!selectedChoices.includes(exercise.targetWord)) {
      selectedChoices[Math.floor(Math.random() * selectedChoices.length)] = exercise.targetWord;
    }
    
    setChoices(exerciseService.shuffleArray(selectedChoices));
    setCurrentRound(prev => prev + 1);
  };

  const handleWordSelect = (selected: string) => {
    const isCorrect = selected === exercise.targetWord;
    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }

    setTimeout(() => {
      if (currentRound < 10) {
        loadNewRound();
      } else {
        handleComplete();
      }
    }, 500);
  };

  const handleComplete = () => {
    const accuracy = (correctCount / 10) * 100;
    onComplete({
      score,
      accuracy: Math.round(accuracy),
      roundsCompleted: currentRound,
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
            Gösterilen kelimeyi 10 turda bulmanız gerekebilir. Her doğru cevap 10 puan, 
            yanlış cevap -5 puan değer.
          </p>
          <ul className='list-disc list-inside text-gray-600 space-y-2'>
            <li>Total 10 tur oynanacak</li>
            <li>Her turda 4 kelime arasından seçim yapacaksınız</li>
            <li>Hız ve doğruluk önemli</li>
          </ul>
        </CardBody>
        <CardFooter>
          <Button 
            variant='primary' 
            className='ml-auto'
            onClick={() => setIsStarted(true)}
          >
            Başla
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (currentRound <= 10) {
    return (
      <Card>
        <CardHeader 
          title={exercise.title}
          subtitle={`Tur ${currentRound} / 10`}
        />
        
        <CardBody>
          <ProgressBar 
            progress={(currentRound / 10) * 100}
            label='İlerleme'
          />
          
          <div className='mt-8 text-center'>
            <p className='text-gray-600 text-sm mb-4'>Aşağıdaki kelimeyi bulun:</p>
            <div className='bg-blue-100 rounded-lg p-6 mb-8 inline-block'>
              <p className='text-2xl font-bold text-blue-900'>{exercise.targetWord.toUpperCase()}</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 my-8'>
            {choices.map((word) => (
              <button
                key={word}
                onClick={() => handleWordSelect(word)}
                className='p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all font-semibold text-lg'
              >
                {word}
              </button>
            ))}
          </div>

          <div className='text-center text-xl font-bold'>
            Skor: <span className='text-blue-600'>{score}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return null;
};

export default WordRecognitionExerciseComponent;
