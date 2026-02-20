'use client';

import { useState, useEffect } from 'react';
import { SpeedReaderExercise as SpeedReaderExerciseType } from '@/types';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { exerciseService } from '@/services/ExerciseService';
import { storageService } from '@/services/StorageService';

interface SpeedReaderExerciseComponentProps {
  exercise: SpeedReaderExerciseType;
  onComplete: (score: number, wpm: number, accuracy: number) => void;
}

type ExercisePhase = 'setup' | 'reading' | 'questions' | 'results';

export const SpeedReaderExerciseComponent: React.FC<SpeedReaderExerciseComponentProps> = ({
  exercise,
  onComplete,
}) => {
  const [phase, setPhase] = useState<ExercisePhase>('setup');
  const [selectedWpm, setSelectedWpm] = useState<number>(300);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);

  // Initialize words
  useEffect(() => {
    const textWords = exercise.text.split(/\s+/).filter((w) => w.length > 0);
    setWords(textWords);
  }, [exercise.text]);

  // Handle word display during reading
  useEffect(() => {
    if (!isPlaying || words.length === 0) return;

    if (currentWordIndex >= words.length) {
      setIsPlaying(false);
      setPhase('questions');
      return;
    }

    setCurrentWord(words[currentWordIndex]);

    // Calculate delay based on WPM
    // Formula: 60000 ms per minute / WPM = ms per word
    const delayMs = Math.max(100, (60000 / selectedWpm));

    const timer = setTimeout(() => {
      setCurrentWordIndex((prev) => prev + 1);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentWordIndex, words, selectedWpm]);

  const handleStartReading = () => {
    setCurrentWordIndex(0);
    setIsPlaying(true);
    setPhase('reading');
  };

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitAnswers = () => {
    // Calculate accuracy
    let correctCount = 0;
    exercise.comprehensionQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const accuracy = exercise.comprehensionQuestions.length > 0 
      ? Math.round((correctCount / exercise.comprehensionQuestions.length) * 100)
      : 0;

    const finalWpm = Math.round((words.length / exercise.duration) * 60);
    const finalScore = exerciseService.calculateScore(correctCount, exercise.comprehensionQuestions.length);

    // Save result
    const result = {
      id: `result-${Date.now()}`,
      exerciseId: exercise.id,
      userId: 'user-1',
      score: finalScore,
      wordsPerMinute: finalWpm,
      accuracy,
      completionTime: exercise.duration,
      completedAt: new Date().toISOString(),
    };

    const existingResults = storageService.getItem<any[]>('results') || [];
    storageService.setItem('results', [...existingResults, result]);

    setScore(finalScore);
    setWpm(finalWpm);
    setPhase('results');
    onComplete(finalScore, finalWpm, accuracy);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {phase === 'setup' && (
        <Card>
          <CardHeader title={exercise.title} subtitle={exercise.description} />
          <CardBody>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">WPM Hızını Seçin</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {exercise.wpmOptions.map((wpmOption) => (
                    <button
                      key={wpmOption}
                      onClick={() => setSelectedWpm(wpmOption)}
                      className={`p-3 rounded-lg font-semibold transition-colors ${
                        selectedWpm === wpmOption
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {wpmOption} WPM
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📖 Nasıl Çalışır?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Metni kelime kelime göstereceğiz (RSVP tekniği)</li>
                  <li>✓ Seçili WPM hızında kelimeler geçecek</li>
                  <li>✓ Okuma bittikten sonra anlama sorularını cevaplayacaksınız</li>
                  <li>✓ Doğru cevaplara göre puanınız hesaplanacak</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <p>📊 <strong>Metin Bilgisi:</strong> {words.length} kelime</p>
                <p>⏱️ <strong>Tahmini Okuma Süresi:</strong> ~{Math.round((words.length / selectedWpm) * 60)} saniye</p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={handleStartReading}>
              Başla
            </Button>
          </CardFooter>
        </Card>
      )}

      {phase === 'reading' && (
        <Card>
          <CardHeader title={exercise.title} subtitle="Metin Okuma" />
          <CardBody>
            <div className="space-y-8">
              {/* WPM Display */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Seçili Hız</p>
                <p className="text-4xl font-bold text-blue-600">{selectedWpm} WPM</p>
              </div>

              {/* Word Display Area */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 min-h-32 flex items-center justify-center border-2 border-blue-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-4">
                    {currentWordIndex + 1} / {words.length}
                  </p>
                  <p className="text-6xl font-bold text-blue-800 break-words px-4">
                    {currentWord}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>İlerleme</span>
                  <span>{Math.round((currentWordIndex / words.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentWordIndex / words.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex gap-3 flex-wrap">
              <Button variant="secondary" onClick={handlePauseResume}>
                {isPlaying ? '⏸️ Duraklat' : '▶️ Devam Et'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setCurrentWordIndex(0);
                  setIsPlaying(false);
                  setPhase('setup');
                }}
              >
                ↻ Sıfırla
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {phase === 'questions' && (
        <Card>
          <CardHeader title="Anlama Sorularına Cevaplayın" subtitle="Metni anladığınızı göstermek için soruları cevaplayın" />
          <CardBody>
            <div className="space-y-6">
              {exercise.comprehensionQuestions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <p className="font-semibold mb-3">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerQuestion(question.id, e.target.value)}
                          className="mr-3"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter>
            <Button 
              variant="primary" 
              onClick={handleSubmitAnswers}
              disabled={Object.keys(answers).length < exercise.comprehensionQuestions.length}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm mb-2">Puan</p>
                <p className="text-4xl font-bold text-blue-600">{score}</p>
                <p className="text-xs text-gray-600 mt-1">/ 100</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm mb-2">Okuma Hızı</p>
                <p className="text-4xl font-bold text-green-600">{wpm}</p>
                <p className="text-xs text-gray-600 mt-1">WPM</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm mb-2">Doğruluk</p>
                <p className="text-4xl font-bold text-purple-600">
                  {Math.round(
                    (Object.values(answers).filter((answer, idx) => 
                      answer === exercise.comprehensionQuestions[idx]?.correctAnswer
                    ).length / exercise.comprehensionQuestions.length) * 100
                  )}%
                </p>
              </div>
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
