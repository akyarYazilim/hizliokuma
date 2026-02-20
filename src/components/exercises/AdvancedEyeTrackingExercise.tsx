'use client';

import { useState, useEffect, useRef } from 'react';
import { AdvancedEyeTrackingExercise as AdvancedEyeTrackingExerciseType } from '@/types';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { exerciseService } from '@/services/ExerciseService';
import { storageService } from '@/services/StorageService';

interface AdvancedEyeTrackingExerciseComponentProps {
  exercise: AdvancedEyeTrackingExerciseType;
  onComplete: (score: number, wpm: number, accuracy: number) => void;
}

type ExercisePhase = 'setup' | 'tracking' | 'results';
type PatternType = 'circle' | 'zigzag' | 'figure8' | 'spiral' | 'square';

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

export const AdvancedEyeTrackingExerciseComponent: React.FC<AdvancedEyeTrackingExerciseComponentProps> = ({
  exercise,
  onComplete,
}) => {
  const [phase, setPhase] = useState<ExercisePhase>('setup');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(exercise.speeds[0]);
  const [selectedSizeMultiplier, setSelectedSizeMultiplier] = useState<number>(
    exercise.sizeMultipliers[0]
  );
  const [selectedPattern, setSelectedPattern] = useState<PatternType>('circle');
  const [timeRemaining, setTimeRemaining] = useState<number>(exercise.duration);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [targetPosition, setTargetPosition] = useState<TargetPosition>({
    x: exercise.trackingArea.width / 2,
    y: exercise.trackingArea.height / 2,
  });
  const [userPosition, setUserPosition] = useState<TargetPosition>({ x: 0, y: 0 });
  const [trackingPoints, setTrackingPoints] = useState<TrackingPoint[]>([]);
  const [targetSize, setTargetSize] = useState<number>(
    exercise.targetSize * selectedSizeMultiplier
  );
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const progressRef = useRef<number>(0);
  const sizePhaseRef = useRef<number>(0);

  // Pattern calculation
  const calculatePatternPosition = (progress: number): TargetPosition => {
    const centerX = exercise.trackingArea.width / 2;
    const centerY = exercise.trackingArea.height / 2;
    const radius = 150;
    const speed = selectedSpeed / 5;

    let x = centerX;
    let y = centerY;

    switch (selectedPattern) {
      case 'circle':
        x = centerX + radius * Math.cos(progress * speed);
        y = centerY + radius * Math.sin(progress * speed);
        break;

      case 'zigzag':
        const zigzagX = (progress * speed) % (exercise.trackingArea.width * 2);
        const zigzagY = centerY + (zigzagX % 300 < 150 ? 100 : -100);
        x = centerX + (zigzagX - exercise.trackingArea.width) / 2;
        y = zigzagY;
        break;

      case 'figure8':
        const figure8Progress = progress * speed;
        x = centerX + radius * Math.sin(figure8Progress);
        y = centerY + radius * Math.sin(figure8Progress) * Math.cos(figure8Progress);
        break;

      case 'spiral':
        const spiralProgress = progress * speed;
        const spiralRadius = 50 + (spiralProgress % 100);
        x = centerX + spiralRadius * Math.cos(spiralProgress);
        y = centerY + spiralRadius * Math.sin(spiralProgress);
        break;

      case 'square':
        const squareProgress = (progress * speed) % 800;
        if (squareProgress < 200) {
          x = centerX - 100 + squareProgress / 2;
          y = centerY - 100;
        } else if (squareProgress < 400) {
          x = centerX + 100;
          y = centerY - 100 + (squareProgress - 200) / 2;
        } else if (squareProgress < 600) {
          x = centerX + 100 - (squareProgress - 400) / 2;
          y = centerY + 100;
        } else {
          x = centerX - 100;
          y = centerY + 100 - (squareProgress - 600) / 2;
        }
        break;
    }

    return { x, y };
  };

  // Start tracking
  const handleStartTracking = () => {
    setPhase('tracking');
    setIsTracking(true);
    setTimeRemaining(exercise.duration);
    setTrackingPoints([]);
    progressRef.current = 0;
  };

  // Update target position and size (animate)
  useEffect(() => {
    if (!isTracking) return;

    const animate = () => {
      progressRef.current += 1;

      // Calculate position based on pattern
      const newPos = calculatePatternPosition(progressRef.current);
      setTargetPosition(newPos);

      // Pulsing size effect
      sizePhaseRef.current = (sizePhaseRef.current + 0.05) % (Math.PI * 2);
      const pulseSize =
        exercise.targetSize * selectedSizeMultiplier * (0.8 + Math.sin(sizePhaseRef.current) * 0.2);
      setTargetSize(pulseSize);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTracking, selectedSpeed, selectedPattern, selectedSizeMultiplier, exercise.targetSize]);

  // Handle mouse/touch movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTracking || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

  const patternEmojis: Record<PatternType, string> = {
    circle: '⭕',
    zigzag: '⚡',
    figure8: '∞',
    spiral: '🌀',
    square: '▢',
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {phase === 'setup' && (
        <Card>
          <CardHeader title={exercise.title} subtitle={exercise.description} />
          <CardBody>
            <div className="space-y-6">
              {/* Speed Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">⚡ Hız</h3>
                <div className="grid grid-cols-4 gap-2">
                  {exercise.speeds.map((speed, idx) => (
                    <button
                      key={speed}
                      onClick={() => setSelectedSpeed(speed)}
                      className={`p-3 rounded-lg font-semibold transition-colors text-sm ${
                        selectedSpeed === speed
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">📏 Boyut</h3>
                <div className="grid grid-cols-3 gap-3">
                  {exercise.sizeMultipliers.map((mult) => (
                    <button
                      key={mult}
                      onClick={() => setSelectedSizeMultiplier(mult)}
                      className={`p-3 rounded-lg font-semibold transition-colors ${
                        selectedSizeMultiplier === mult
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {mult === 0.8 ? 'Küçük' : mult === 1.0 ? 'Normal' : 'Büyük'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">🔄 Hareket Deseni</h3>
                <div className="grid grid-cols-5 gap-2">
                  {exercise.patterns.map((pattern) => (
                    <button
                      key={pattern}
                      onClick={() => setSelectedPattern(pattern)}
                      className={`p-3 rounded-lg font-bold transition-colors text-center ${
                        selectedPattern === pattern
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-lg">{patternEmojis[pattern]}</div>
                      <div className="text-xs mt-1 capitalize">
                        {pattern === 'circle'
                          ? 'Daire'
                          : pattern === 'zigzag'
                          ? 'Zigzag'
                          : pattern === 'figure8'
                          ? '8 Şekli'
                          : pattern === 'spiral'
                          ? 'Spiral'
                          : 'Kare'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📖 Nasıl Çalışır?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Topu seçtiğiniz desende hareket edecek</li>
                  <li>✓ Boyutu pulslanacak (nabız atıyor gibi)</li>
                  <li>✓ Hızı ve zorluk seviyesini önceden belirle</li>
                  <li>✓ Kursörünüzü topu takip etmek için hareket ettirin</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <p>⏱️ <strong>Egzersiz Süresi:</strong> {exercise.duration} saniye</p>
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
          <CardHeader
            title={exercise.title}
            subtitle={`${patternEmojis[selectedPattern]} ${
              selectedPattern === 'circle'
                ? 'Daire'
                : selectedPattern === 'zigzag'
                ? 'Zigzag'
                : selectedPattern === 'figure8'
                ? '8 Şekli'
                : selectedPattern === 'spiral'
                ? 'Spiral'
                : 'Kare'
            } - Kalan: ${timeRemaining}s`}
          />
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
                  className="absolute bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg transition-all"
                  style={{
                    width: `${targetSize}px`,
                    height: `${targetSize}px`,
                    left: `${(targetPosition.x / exercise.trackingArea.width) * 100}%`,
                    top: `${(targetPosition.y / exercise.trackingArea.height) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
                  }}
                />

                {/* User Position Indicator */}
                {userPosition.x > 0 && userPosition.y > 0 && (
                  <div
                    className="absolute border-3 border-green-500 rounded-full pointer-events-none"
                    style={{
                      width: '50px',
                      height: '50px',
                      left: userPosition.x,
                      top: userPosition.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}

                {/* Instructions */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500 font-semibold">
                    Topu takip et →
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Takip Noktaları</p>
                  <p className="text-2xl font-bold text-blue-600">{trackingPoints.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Orta Uzaklık</p>
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
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Deseni</p>
                  <p className="text-xl font-bold text-purple-600">{patternEmojis[selectedPattern]}</p>
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
                <li>✓ Deseni: {patternEmojis[selectedPattern]} {selectedPattern}</li>
                <li>✓ Hızı: {selectedSpeed}</li>
                <li>✓ Boyut: {selectedSizeMultiplier === 0.8 ? 'Küçük' : selectedSizeMultiplier === 1.0 ? 'Normal' : 'Büyük'}</li>
                <li>
                  ✓ Orta hatası:{' '}
                  {trackingPoints.length > 0
                    ? (
                        trackingPoints.reduce((sum, p) => sum + p.distance, 0) /
                        trackingPoints.length
                      ).toFixed(1)
                    : 0}
                  px
                </li>
                <li>
                  ✓{' '}
                  {accuracy >= 80
                    ? '🌟 Mükemmel göz kontrolü ve koordinasyonu!'
                    : accuracy >= 60
                    ? '👍 İyi başarı, daha zorlu seviyeler dene'
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

export default AdvancedEyeTrackingExerciseComponent;
