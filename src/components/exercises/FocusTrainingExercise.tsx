'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '@/types';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { storageService } from '@/services/StorageService';

interface FocusTrainingComponentProps {
  exercise: Exercise;
  onComplete: (score: number, wpm: number, accuracy: number) => void;
}

type ExercisePhase = 'setup' | 'running' | 'results';

interface GridCell {
  id: number;
  isTarget: boolean;
  clicked: boolean;
  reaction: number; // milliseconds
}

export const FocusTrainingComponent: React.FC<FocusTrainingComponentProps> = ({
  exercise,
  onComplete,
}) => {
  const [phase, setPhase] = useState<ExercisePhase>('setup');
  const [gridSize, setGridSize] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(exercise.duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [totalMissClicks, setTotalMissClicks] = useState<number>(0);
  const [reactions, setReactions] = useState<number[]>([]);

  // Initialize grid
  const initializeGrid = () => {
    const size = gridSize * gridSize;
    const cells: GridCell[] = Array.from({ length: size }, (_, i) => ({
      id: i,
      isTarget: i === Math.floor(Math.random() * size),
      clicked: false,
      reaction: 0,
    }));
    setGrid(cells);
  };

  // Start exercise
  const handleStartExercise = () => {
    initializeGrid();
    setPhase('running');
    setIsRunning(true);
    setScore(0);
    setCurrentRound(0);
    setTotalMissClicks(0);
    setReactions([]);
  };

  // Handle cell click
  const handleCellClick = (cellId: number) => {
    if (!isRunning) return;

    const clickedCell = grid.find((c) => c.id === cellId);
    if (!clickedCell) return;
    if (clickedCell.clicked) return;

    const updatedGrid = grid.map((c) =>
      c.id === cellId ? { ...c, clicked: true } : c
    );
    setGrid(updatedGrid);

    if (clickedCell.isTarget) {
      // Correct click
      setScore((prev) => prev + 10);
      setReactions((prev) => [...prev, Math.random() * 500]); // Simulated reaction time
      setCurrentRound((prev) => prev + 1);

      // New target
      setTimeout(() => {
        initializeGrid();
      }, 300);
    } else {
      // Wrong click
      setTotalMissClicks((prev) => prev + 1);
      if (totalMissClicks + 1 >= 3) {
        handleFinishExercise();
      }
    }
  };

  // Timer
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Check if time is over
  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      handleFinishExercise();
    }
  }, [timeRemaining, isRunning]);

  const handleFinishExercise = () => {
    setIsRunning(false);
    const avgReaction = reactions.length > 0
      ? Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length)
      : 0;
    const accuracy = Math.max(0, Math.round((currentRound / (currentRound + totalMissClicks)) * 100) || 0);

    const result = {
      id: `result-${Date.now()}`,
      exerciseId: exercise.id,
      userId: 'user-1',
      score,
      completionTime: exercise.duration - timeRemaining,
      completedAt: new Date().toISOString(),
    };

    const existingResults = storageService.getItem<any[]>('results') || [];
    storageService.setItem('results', [...existingResults, result]);

    setPhase('results');
    onComplete(score, 0, accuracy);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {phase === 'setup' && (
        <Card>
          <CardHeader title={exercise.title} subtitle={exercise.description} />
          <CardBody>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Grid Boyutu Seç</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[3, 4, 5].map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size)}
                      className={`p-4 rounded-lg font-semibold transition-colors ${
                        gridSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {size}x{size}
                      <div className="text-xs mt-1">
                        {size === 3 ? 'Kolay' : size === 4 ? 'Orta' : 'Zor'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📖 Nasıl Çalışır?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Hızlı bir şekilde hedefi bulun ve tıklayın</li>
                  <li>✓ Her doğru tıklama +10 puan kazanır</li>
                  <li>✓ 3 yanlış tıklamadan sonra oyun sona erer</li>
                  <li>✓ Konsantrasyon ve hızınızı test edin</li>
                  <li>✓ {exercise.duration} saniye boyunca oynayın</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <p>⏱️ <strong>Egzersiz Süresi:</strong> {exercise.duration} saniye</p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={handleStartExercise}>
              Başla
            </Button>
          </CardFooter>
        </Card>
      )}

      {phase === 'running' && (
        <Card>
          <CardHeader
            title={exercise.title}
            subtitle={`Puan: ${score} | Yanlış: ${totalMissClicks}/3 | Kalan: ${timeRemaining}s`}
          />
          <CardBody>
            <div className="flex flex-col items-center justify-center py-8">
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  maxWidth: `${gridSize * 80}px`,
                }}
              >
                {grid.map((cell) => (
                  <button
                    key={cell.id}
                    onClick={() => handleCellClick(cell.id)}
                    className={`aspect-square rounded-lg font-semibold text-2xl transition-all transform ${
                      cell.isTarget
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg scale-105 animate-pulse'
                        : cell.clicked
                        ? 'bg-red-300 text-red-700 cursor-not-allowed'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    disabled={cell.clicked}
                  >
                    {cell.isTarget && !cell.clicked && '🎯'}
                    {cell.clicked && cell.isTarget && '✅'}
                    {cell.clicked && !cell.isTarget && '❌'}
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-lg">Mavi hücreye tıklayın!</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {phase === 'results' && (
        <Card>
          <CardHeader title="Sonuçlar" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Toplam Puan</p>
                <p className="text-5xl font-bold text-blue-600">{score}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Doğru Tıklama</p>
                <p className="text-5xl font-bold text-green-600">{currentRound}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Yanlış Tıklama</p>
                <p className="text-5xl font-bold text-red-600">{totalMissClicks}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Tavsiye</h4>
              <p className="text-sm text-gray-700">
                {score >= 100
                  ? '🌟 Harika! Odaklanma yeteneğin mükemmel!'
                  : score >= 50
                  ? 'İyi başlangıç! Düzenli antrenmanla daha iyi olacaksın.'
                  : 'Daha fazla pratik yap. Konsantrasyonunuzu geliştirin.'}
              </p>
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

export default FocusTrainingComponent;
