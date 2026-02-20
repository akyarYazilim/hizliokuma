'use client';

import React from 'react';
import { SpeedTestExercise, ComprehensionQuestion } from '@/types';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';
import { useState } from 'react';

interface SpeedReadingExerciseProps {
  exercise: SpeedTestExercise;
  onComplete: (results: { wpm: number; accuracy: number; correctAnswers: number }) => void;
}

export const SpeedReadingExercise: React.FC<SpeedReadingExerciseProps> = ({
  exercise,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'reading' | 'questions'>('reading');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleReadingComplete = () => {
    setStartTime(Date.now());
    setPhase('questions');
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    if (!startTime || !exercise.comprehensionQuestions) return;

    const readingTime = (Date.now() - startTime) / 1000;
    const wordCount = exercise.text.split(/\s+/).length;
    const wpm = Math.round((wordCount / readingTime) * 60);

    const correctAnswers = exercise.comprehensionQuestions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length;
    const accuracy = (correctAnswers / exercise.comprehensionQuestions.length) * 100;

    onComplete({
      wpm,
      accuracy: Math.round(accuracy),
      correctAnswers,
    });
  };

  return (
    <Card>
      {phase === 'reading' ? (
        <>
          <CardHeader 
            title={exercise.title}
            subtitle='Metni okuyun, ardından soruları cevaplayacaksınız'
          />
          <CardBody>
            <div className='bg-gray-50 p-6 rounded-lg leading-relaxed text-gray-800 text-lg h-96 overflow-y-auto'>
              {exercise.text}
            </div>
          </CardBody>
          <CardFooter>
            <Button 
              variant='primary' 
              className='ml-auto'
              onClick={handleReadingComplete}
            >
              Soruları Cevaplamaya Başla
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader 
            title='Anlama Soruları'
            subtitle={`${Object.keys(answers).length} / ${exercise.comprehensionQuestions?.length} cevaplanmış`}
          />
          
          <CardBody>
            <ProgressBar 
              progress={(Object.keys(answers).length / (exercise.comprehensionQuestions?.length || 1)) * 100}
              label='İlerleme'
            />
            
            <div className='mt-6 space-y-6'>
              {exercise.comprehensionQuestions?.map((question, idx) => (
                <div key={question.id} className='border-l-4 border-blue-600 pl-4'>
                  <p className='font-semibold text-gray-400 mb-3'>
                    {idx + 1}. {question.question}
                  </p>
                  <div className='space-y-2'>
                    {question.options.map((option, optIdx) => (
                      <label key={optIdx} className='flex items-center gap-3 cursor-pointer'>
                        <input
                          type='radio'
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() => handleAnswerSelect(question.id, option)}
                          className='w-4 h-4'
                        />
                        <span className='text-gray-700'>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>

          <CardFooter>
            <Button 
              variant='secondary'
              onClick={() => setPhase('reading')}
            >
              Geri Dön
            </Button>
            <Button 
              variant='primary'
              className='ml-auto'
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== exercise.comprehensionQuestions?.length}
            >
              Tamamla
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default SpeedReadingExercise;
