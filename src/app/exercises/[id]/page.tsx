'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import SpeedReadingExercise from '@/components/exercises/SpeedReadingExercise';
import WordRecognitionExerciseComponent from '@/components/exercises/WordRecognitionExercise';
import PeripheralVisionExercise from '@/components/exercises/PeripheralVisionExercise';
import SpeedReaderExerciseComponent from '@/components/exercises/SpeedReaderExercise';
import SmoothPursuitExerciseComponent from '@/components/exercises/SmoothPursuitExercise';
import AdvancedEyeTrackingExerciseComponent from '@/components/exercises/AdvancedEyeTrackingExercise';
import RapidWordRecognitionComponent from '@/components/exercises/RapidWordRecognitionExercise';
import { exerciseService } from '@/services/ExerciseService';
import { storageService } from '@/services/StorageService';
import { Exercise, ExerciseResult, SpeedTestExercise, WordRecognitionExercise as WordRecognitionExerciseType, PeripheralVisionExercise as PeripheralVisionExerciseType, SpeedReaderExercise as SpeedReaderExerciseType, SmoothPursuitExercise as SmoothPursuitExerciseType, AdvancedEyeTrackingExercise as AdvancedEyeTrackingExerciseType, RapidWordRecognitionExercise as RapidWordRecognitionExerciseType } from '@/types';
import { formatPercentage, getScoreBadge, getWPMLevel } from '@/utils/formatters';
import { Card as CardComponent, CardHeader as CardHeaderComponent, CardBody as CardBodyComponent } from '@/components/common/Card';

interface ExercisePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ExercisePage({ params }: ExercisePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<ExerciseResult | null>(null);

  // Load exercise on mount
  useEffect(() => {
    const loadedExercise = exerciseService.getExerciseById(id);
    if (loadedExercise) {
      setExercise(loadedExercise);
    } else {
      // Exercise not found, redirect to exercises page
      router.push('/exercises');
    }
  }, [id, router]);

  const handleExerciseComplete = (results: any) => {
    if (!exercise) return;

    const score = Math.round(results.score || (results.accuracy || 0));
    const completionTime = results.completionTime || exercise.duration;

    const newResult = exerciseService.createExerciseResult(
      exercise.id,
      'user_' + Math.random().toString(36).substr(2, 9),
      score,
      completionTime,
      {
        wordsPerMinute: results.wpm,
        accuracy: results.accuracy,
      }
    );

    setResult(newResult);

    // Save to localStorage
    const results_list = storageService.getItem<ExerciseResult[]>('results', []) || [];
    storageService.setItem('results', [...results_list, newResult]);

    setIsCompleted(true);
  };

  const handleRetry = () => {
    setIsCompleted(false);
    setResult(null);
  };

  const handleBackToExercises = () => {
    router.push('/exercises');
  };

  if (!exercise) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Egzersiz yükleniyor...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (isCompleted && result) {
    const scoreBadge = getScoreBadge(result.score);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader title={exercise.title} subtitle="Egzersiz Tamamlandı!" />

          <CardBody>
            <div className="text-center space-y-6">
              {/* Score Badge */}
              <div className="inline-block">
                <div className={`px-6 py-4 rounded-lg bg-${scoreBadge.color}-100`}>
                  <p className={`text-4xl font-bold text-${scoreBadge.color}-600`}>
                    {result.score}
                  </p>
                  <p className={`text-${scoreBadge.color}-800 font-semibold mt-2`}>
                    {scoreBadge.label}
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.completionTime && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Harcanan Zaman</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(result.completionTime)}s
                    </p>
                  </div>
                )}

                {result.wordsPerMinute && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Okuma Hızı</p>
                    <p className="text-2xl font-bold text-green-600">
                      {result.wordsPerMinute} WPM
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getWPMLevel(result.wordsPerMinute)}
                    </p>
                  </div>
                )}

                {result.accuracy !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Doğruluk</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {result.accuracy}%
                    </p>
                  </div>
                )}
              </div>

              {/* Message */}
              <p className="text-gray-700 max-w-md mx-auto">
                {result.score >= 80
                  ? 'Harika çalışma! Hızına ve doğruluğuna bak!'
                  : result.score >= 60
                  ? 'İyi çalışma! Düzenli antrenmanla ilerleme göreceksin.'
                  : 'Başarı için daha fazla pratik yapman gerekiyor. Tekrar dene!'}
              </p>
            </div>
          </CardBody>

          <CardFooter className="flex-col gap-3">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={handleRetry}
            >
              Tekrar Dene
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={handleBackToExercises}
            >
              Diğer Egzersizlere Dön
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render appropriate exercise component
  const renderExerciseContent = () => {
    if (exercise.category === 'speed-test') {
      return (
        <SpeedReadingExercise
          exercise={exercise as SpeedTestExercise}
          onComplete={handleExerciseComplete}
        />
      );
    } else if (exercise.category === 'word-recognition') {
      return (
        <WordRecognitionExerciseComponent
          exercise={exercise as WordRecognitionExerciseType}
          onComplete={handleExerciseComplete}
        />
      );
    } else if (exercise.category === 'speedreader') {
      return (
        <SpeedReaderExerciseComponent
          exercise={exercise as SpeedReaderExerciseType}
          onComplete={handleExerciseComplete}
        />
      );
    } else if (exercise.category === 'smooth-pursuit') {
      return (
        <SmoothPursuitExerciseComponent
          exercise={exercise as SmoothPursuitExerciseType}
          onComplete={handleExerciseComplete}
        />
      );
    } else if (exercise.category === 'advanced-eye-tracking') {
      return (
        <AdvancedEyeTrackingExerciseComponent
          exercise={exercise as AdvancedEyeTrackingExerciseType}
          onComplete={handleExerciseComplete}
        />
      );
    } else if (exercise.category === 'peripheral-vision') {
      return (
        <PeripheralVisionExercise
          exercise={exercise as PeripheralVisionExerciseType}
          onComplete={handleExerciseComplete}
        />
      );
    } else if (exercise.category === 'rapid-word-recognition') {
      return (
        <RapidWordRecognitionComponent
          exercise={exercise as RapidWordRecognitionExerciseType}
          onComplete={handleExerciseComplete}
        />
      );
    }

    return (
      <Card>
        <CardBody>
          <p className="text-gray-600">Bu egzersiz türü şu anda desteği yok.</p>
        </CardBody>
        <CardFooter>
          <Button variant="secondary" onClick={handleBackToExercises}>
            Geri Dön
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderExerciseContent()}
      
      <div className="text-center">
        <Button 
          variant="secondary"
          onClick={handleBackToExercises}
        >
          ← Geri Dön
        </Button>
      </div>
    </div>
  );
}
