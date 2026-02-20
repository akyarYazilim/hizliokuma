'use client';

import { useState, useEffect, useRef } from 'react';
import { SmoothPursuitExercise as SmoothPursuitExerciseType } from '@/types';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { exerciseService } from '@/services/ExerciseService';
import { storageService } from '@/services/StorageService';

interface SmoothPursuitExerciseComponentProps {
  exercise: SmoothPursuitExerciseType;
  onComplete: (score: number, wpm: number, accuracy: number) => void;
}

type ExercisePhase = 'setup' | 'tracking' | 'results';

interface TargetPosition {
  x: number;
  y: number;
}

interface TrackingPoint {
  targetX: number;
  targetY: number;
  userX: number;
  userY: number;
  distance: number;
  timestamp: number;
}

export const SmoothPursuitExerciseComponent: React.FC<SmoothPursuitExerciseComponentProps> = ({
  exercise,
  onComplete,
}) => {
  const [phase, setPhase] = useState<ExercisePhase>('setup');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(exercise.speeds[0]);
  const [timeRemaining, setTimeRemaining] = useState<number>(exercise.duration);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [targetPosition, setTargetPosition] = useState<TargetPosition>({
    x: exercise.trackingArea.width / 2,
    y: exercise.trackingArea.height / 2,
  });
  const [userPosition, setUserPosition] = useState<TargetPosition>({ x: 0, y: 0 });
  const [trackingPoints, setTrackingPoints] = useState<TrackingPoint[]>([]);
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const velocityRef = useRef({ x: 2, y: 2 });

  // Start tracking
  const handleStartTracking = () => {
    setPhase('tracking');
    setIsTracking(true);
    setTimeRemaining(exercise.duration);
    setTrackingPoints([]);
  };

  // Update target position (animate)
  useEffect(() => {
    if (!isTracking) return;

    const animate = () => {
      setTargetPosition((prev) => {
        let newX = prev.x + velocityRef.current.x * (selectedSpeed / 2);
        let newY = prev.y + velocityRef.current.y * (selectedSpeed / 2);

        // Bounce off walls
        if (newX <= 0 || newX >= exercise.trackingArea.width) {
          velocityRef.current.x *= -1;
          newX = Math.max(0, Math.min(exercise.trackingArea.width, newX));
        }

        if (newY <= 0 || newY >= exercise.trackingArea.height) {
          velocityRef.current.y *= -1;
          newY = Math.max(0, Math.min(exercise.trackingArea.height, newY));
        }

        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTracking, selectedSpeed, exercise.trackingArea]);

  // Handle mouse/touch movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTracking || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setUserPosition({ x, y });

    // Calculate distance from target
    const distance = Math.sqrt(
      Math.pow(x - targetPosition.x, 2) + Math.pow(y - targetPosition.y, 2)
    );

    setTrackingPoints((prev) => [
      ...prev,
      {
        targetX: targetPosition.x,
        targetY: targetPosition.y,
        userX: x,
        userY: y,
        distance,
        timestamp: Date.now(),
      },
    ]);
  };

  // Handle touch
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTracking || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setUserPosition({ x, y });

    const distance = Math.sqrt(
      Math.pow(x - targetPosition.x, 2) + Math.pow(y - targetPosition.y, 2)
    );

    setTrackingPoints((prev) => [
      ...prev,
      {
        targetX: targetPosition.x,
        targetY: targetPosition.y,
        userX: x,
        userY: y,
        distance,
        timestamp: Date.now(),
      },
    ]);
  };

  // Timer
  useEffect(() => {
    if (!isTracking) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTracking(false);
          handleFinishTracking();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTracking]);

  const handleFinishTracking = () => {
    // Calculate accuracy
    if (trackingPoints.length === 0) return;

    const avgDistance =
      trackingPoints.reduce((sum, p) => sum + p.distance, 0) / trackingPoints.length;
    const maxDistance = Math.sqrt(
      Math.pow(exercise.trackingArea.width, 2) + Math.pow(exercise.trackingArea.height, 2)
    );

    const calculatedAccuracy = Math.max(0, 100 - (avgDistance / maxDistance) * 100);
    const finalScore = Math.round(calculatedAccuracy);

    setAccuracy(Math.round(calculatedAccuracy * 10) / 10);
    setScore(finalScore);

    // Save result
    const result = {
      id: `result-${Date.now()}`,
      exerciseId: exercise.id,
      userId: 'user-1',
      score: finalScore,
      accuracy: calculatedAccuracy,
      completionTime: exercise.duration,
      completedAt: new Date().toISOString(),
    };

    const existingResults = storageService.getItem<any[]>('results') || [];
    storageService.setItem('results', [...existingResults, result]);

    setPhase('results');
    onComplete(finalScore, 0, calculatedAccuracy);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {phase === 'setup' && (
        <Card>
          <CardHeader title={exercise.title} subtitle={exercise.description} />
          <CardBody>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Hız Seviyesini Seçin</h3>
                <div className="grid grid-cols-3 gap-3">
                  {exercise.speeds.map((speed, idx) => (
                    <button
                      key={speed}
                      onClick={() => setSelectedSpeed(speed)}
                      className={`p-4 rounded-lg font-semibold transition-colors text-center ${
                        selectedSpeed === speed
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-lg">
                        {idx === 0 ? '🐌' : idx === 1 ? '🏃' : '🚀'}
                      </div>
                      <div className="text-sm">Hız {idx + 1}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📖 Nasıl Çalışır?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Ekranda hareket eden mavi topunuz göreceksiniz</li>
                  <li>✓ Kursörünüzü (mouse/dokunuş) topun üzerine yerleştirmeye çalışın</li>
                  <li>✓ Top hiç durmadan hareket etmeye devam edecek</li>
                  <li>✓ Göz takip yeteneğiniz ve kontrol becerileriniz ölçülecek</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <p>⏱️ <strong>Egzersiz Süresi:</strong> {exercise.duration} saniye</p>
                <p>🎯 <strong>Seçili Hız Seviyesi:</strong> {exercise.speeds.indexOf(selectedSpeed) + 1}</p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={handleStartTracking}>
              Başla
            </Button>
          </CardFooter>
        </Card>
      )}

      {phase === 'tracking' && (
        <Card>
          <CardHeader title={exercise.title} subtitle={`Kalan Süre: ${timeRemaining}s`} />
          <CardBody>
            <div className="space-y-4">
              {/* Tracking Area */}
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden cursor-none"
                style={{
                  width: '100%',
                  height: '400px',
                  maxWidth: `${exercise.trackingArea.width}px`,
                  aspectRatio: `${exercise.trackingArea.width} / ${exercise.trackingArea.height}`,
                  touchAction: 'none',
                }}
              >
                {/* Target Circle */}
                <div
                  className="absolute bg-blue-500 rounded-full shadow-lg transition-all"
                  style={{
                    width: `${exercise.targetSize}px`,
                    height: `${exercise.targetSize}px`,
                    left: `${(targetPosition.x / exercise.trackingArea.width) * 100}%`,
                    top: `${(targetPosition.y / exercise.trackingArea.height) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
                  }}
                />

                {/* User Position Indicator */}
                {userPosition.x > 0 && userPosition.y > 0 && (
                  <div
                    className="absolute border-2 border-green-500 rounded-full pointer-events-none"
                    style={{
                      width: '40px',
                      height: '40px',
                      left: userPosition.x,
                      top: userPosition.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}

                {/* Instructions */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500 font-semibold">
                    Mavi topu takip edin →
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Takip Noktaları</p>
                  <p className="text-2xl font-bold text-blue-600">{trackingPoints.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Ortalama Uzaklık</p>
                  <p className="text-2xl font-bold text-green-600">
                    {trackingPoints.length > 0
                      ? Math.round(
                          trackingPoints.reduce((sum, p) => sum + p.distance, 0) /
                            trackingPoints.length
                        )
                      : 0}
                    px
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {phase === 'results' && (
        <Card>
          <CardHeader title="Sonuçlar" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Takip Doğruluğu</p>
                <p className="text-5xl font-bold text-blue-600">{Math.round(accuracy)}%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Puan</p>
                <p className="text-5xl font-bold text-purple-600">{score}</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📊 Özet</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Toplam takip süresi: {exercise.duration} saniye</li>
                <li>✓ Toplam takip noktaları: {trackingPoints.length}</li>
                <li>
                  ✓ Ortalama hatası:{' '}
                  {trackingPoints.length > 0
                    ? (
                        trackingPoints.reduce((sum, p) => sum + p.distance, 0) /
                        trackingPoints.length
                      ).toFixed(1)
                    : 0}
                  px
                </li>
                <li>
                  ✓ İyi başarı!{' '}
                  {accuracy >= 80
                    ? '🌟 Mükemmel göz kontrolü'
                    : accuracy >= 60
                    ? '👍 İyi performans'
                    : '💪 Daha fazla pratik ile geliştirebilirsin'}
                </li>
              </ul>
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary" onClick={() => window.location.reload()}>
                🔄 Tekrar Yap
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/exercises'}
              >
                ← Geri Dön
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SmoothPursuitExerciseComponent;
