'use client';

import { useState, useEffect } from 'react';
import { RapidWordRecognitionExercise as RapidWordRecognitionExerciseType } from '@/types';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { exerciseService } from '@/services/ExerciseService';
import { storageService } from '@/services/StorageService';

interface RapidWordRecognitionComponentProps {
  exercise: RapidWordRecognitionExerciseType;
  onComplete: (score: number, wpm: number, accuracy: number) => void;
}

type ExercisePhase = 'setup' | 'preparation' | 'testing' | 'question' | 'results';

interface TestResult {
  word: string;
  userAnswer: string;
  correct: boolean;
}

export const RapidWordRecognitionComponent: React.FC<RapidWordRecognitionComponentProps> = ({
  exercise,
  onComplete,
}) => {
  const [phase, setPhase] = useState<ExercisePhase>('setup');
  const [displayDuration, setDisplayDuration] = useState<number>(exercise.displayDuration);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showWord, setShowWord] = useState<boolean>(false);
  const [testWords, setTestWords] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(exercise.duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Shuffle array helper
  const shuffleArray = (arr: string[]) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate test words
  const generateTestWords = () => {
    const selected = [];
    for (let i = 0; i < exercise.roundCount; i++) {
      selected.push(exercise.words[Math.floor(Math.random() * exercise.words.length)]);
    }
    return selected;
  };

  // Start exercise
  const handleStartExercise = () => {
    const words = generateTestWords();
    setTestWords(words);
    setPhase('preparation');
    setIsRunning(true);
    setCurrentRound(0);
    setResults([]);
  };

  // Prepare and show word
  useEffect(() => {
    if (phase !== 'preparation') return;

    // Small delay before showing word
    const prepTimer = setTimeout(() => {
      setShowWord(true);

      // Hide the word after displayDuration
      const hideTimer = setTimeout(() => {
        setShowWord(false);
        setPhase('question');
        setSelectedAnswer('');
      }, displayDuration);

      return () => clearTimeout(hideTimer);
    }, 500);

    return () => clearTimeout(prepTimer);
  }, [phase, displayDuration]);

  // Set up word options when entering question phase
  useEffect(() => {
    if (phase !== 'question') return;

    const word = testWords[currentRound];
    setCurrentWord(word);

    // Create 4 options: correct answer + 3 random wrong answers
    let options = [word];
    const availableWords = exercise.words.filter((w) => w !== word);

    for (let i = 0; i < 3 && availableWords.length > 0; i++) {
      const randomIdx = Math.floor(Math.random() * availableWords.length);
      options.push(availableWords[randomIdx]);
      availableWords.splice(randomIdx, 1);
    }

    setWordOptions(shuffleArray(options));
  }, [phase, currentRound, testWords, exercise.words]);

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentWord;
    setResults((prev) => [
      ...prev,
      {
        word: currentWord,
        userAnswer: selectedAnswer,
        correct: isCorrect,
      },
    ]);

    if (currentRound + 1 < exercise.roundCount) {
      setCurrentRound(currentRound + 1);
      setPhase('preparation');
    } else {
      handleFinishExercise();
    }
  };

  const handleFinishExercise = () => {
    const correctCount = results.filter((r) => r.correct).length;
    const accuracy = (correctCount / results.length) * 100;
    const finalScore = Math.round(accuracy);

    // Save result
    const result = {
      id: `result-${Date.now()}`,
      exerciseId: exercise.id,
      userId: 'user-1',
      score: finalScore,
      accuracy,
      completionTime: exercise.duration - timeRemaining,
      completedAt: new Date().toISOString(),
    };

    const existingResults = storageService.getItem<any[]>('results') || [];
    storageService.setItem('results', [...existingResults, result]);

    setPhase('results');
    setIsRunning(false);
    onComplete(finalScore, 0, accuracy);
  };

  // Timer
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          handleFinishExercise();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentRound, results]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {phase === 'setup' && (
        <Card>
          <CardHeader title={exercise.title} subtitle={exercise.description} />
          <CardBody>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Kelimenin Ekranda Kalış Süresi</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[500, 800, 1000, 1500].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setDisplayDuration(duration)}
                      className={`p-4 rounded-lg font-semibold transition-colors ${
                        displayDuration === duration
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {duration}ms
                      <div className="text-xs mt-1">
                        {duration === 500
                          ? 'Çok Hızlı'
                          : duration === 800
                          ? 'Hızlı'
                          : duration === 1000
                          ? 'Normal'
                          : 'Yavaş'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📖 Nasıl Çalışır?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Rastgele bir kelime ekranda gösterilecek</li>
                  <li>✓ Kelime seçtiğiniz sürece kalacak, sonra kaybolacak</li>
                  <li>✓ 4 seçenekten doğru kelimeyi seçin</li>
                  <li>✓ {exercise.roundCount} kelime ile test edileceksiniz</li>
                  <li>✓ Doğru cevaplara göre puan alacaksınız</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <p>⏱️ <strong>Egzersiz Süresi:</strong> {exercise.duration} saniye</p>
                <p>📊 <strong>Kelime Sayısı:</strong> {exercise.roundCount}</p>
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

      {phase === 'preparation' && (
        <Card>
          <CardHeader
            title={exercise.title}
            subtitle={`Hazırlanın... (Round ${currentRound + 1}/${exercise.roundCount})`}
          />
          <CardBody>
            <div className="flex flex-col items-center justify-center py-16">
              {showWord ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Kelimeyi görün:</p>
                  <div className="text-6xl font-bold text-blue-600 animate-pulse">
                    {currentWord}
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    {Math.ceil(displayDuration / 100) * 100}ms için gösterildi
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-5xl text-gray-400 mb-4">👀</div>
                  <p className="text-gray-600">Kelimenin tadında...</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {phase === 'question' && (
        <Card>
          <CardHeader
            title="Kelime Seç"
            subtitle={`Round ${currentRound + 1}/${exercise.roundCount}`}
          />
          <CardBody>
            <div className="space-y-6">
              <p className="text-center text-lg font-semibold text-gray-700">
                Gördüğünüz kelimeyi gösterilenlerin arasından seçin:
              </p>

              <div className="grid grid-cols-2 gap-4">
                {wordOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-4 rounded-lg font-semibold transition-all border-2 ${
                      selectedAnswer === option
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Klanı tıkladığınız zaman kelimenin resmini aklınıza getirerek seçim yapın.
                </p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
            >
              Gönder
            </Button>
          </CardFooter>
        </Card>
      )}

      {phase === 'results' && (
        <Card>
          <CardHeader title="Sonuçlar" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Doğruluk</p>
                <p className="text-5xl font-bold text-blue-600">
                  {Math.round((results.filter((r) => r.correct).length / results.length) * 100)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Doğru Cevap</p>
                <p className="text-5xl font-bold text-green-600">
                  {results.filter((r) => r.correct).length} / {results.length}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-4">📊 Detaylı Sonuçlar</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-sm ${
                      result.correct
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <span className="font-semibold">
                      {result.correct ? '✅' : '❌'} #{idx + 1}:
                    </span>{' '}
                    <span className="ml-1">
                      Doğru: {result.word} | Senin: {result.userAnswer}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Tavsiye</h4>
              <p className="text-sm text-gray-700">
                {Math.round((results.filter((r) => r.correct).length / results.length) * 100) >=
                80
                  ? '🌟 Harika! Kelime tanıma yeteneğin çok iyi!'
                  : 'Daha fazla pratik yap. Kelimeleri daha iyi hatırlamaya çalış.'}
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

export default RapidWordRecognitionComponent;
