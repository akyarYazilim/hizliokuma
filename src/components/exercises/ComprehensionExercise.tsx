'use client';

import { useState, useEffect } from 'react';
import { SpeedTestExercise } from '@/types';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { storageService } from '@/services/StorageService';

interface ComprehensionComponentProps {
  exercise: SpeedTestExercise;
  onComplete: (score: number, wpm: number, accuracy: number) => void;
}

type ExercisePhase = 'preparation' | 'reading' | 'questions' | 'results';

interface Answer {
  questionId: string;
  answer: string;
  correct: boolean;
}

export const ComprehensionComponent: React.FC<ComprehensionComponentProps> = ({
  exercise,
  onComplete,
}) => {
  const [phase, setPhase] = useState<ExercisePhase>('preparation');
  const [readingStartTime, setReadingStartTime] = useState<number>(0);
  const [readingEndTime, setReadingEndTime] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const questions = exercise.comprehensionQuestions || [];

  // Start reading phase
  const handleStartReading = () => {
    setReadingStartTime(Date.now());
    setPhase('reading');
  };

  // Finish reading and go to questions
  const handleFinishReading = () => {
    setReadingEndTime(Date.now());
    setPhase('questions');
    setCurrentQuestionIdx(0);
    setSelectedAnswer('');
  };

  // Submit answer
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIdx];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        correct: isCorrect,
      },
    ]);

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer('');
    } else {
      handleFinishExercise();
    }
  };

  const handleFinishExercise = () => {
    const correctCount = answers.filter((a) => a.correct).length;
    const accuracy = (correctCount / answers.length) * 100;
    const readingTime = (readingEndTime - readingStartTime) / 1000;
    const wpm = Math.round((exercise.wordCount / readingTime) * 60);

    const result = {
      id: `result-${Date.now()}`,
      exerciseId: exercise.id,
      userId: 'user-1',
      score: Math.round(accuracy),
      wordsPerMinute: wpm,
      accuracy,
      completionTime: readingTime,
      completedAt: new Date().toISOString(),
    };

    const existingResults = storageService.getItem<any[]>('results') || [];
    storageService.setItem('results', [...existingResults, result]);

    setPhase('results');
    onComplete(Math.round(accuracy), wpm, accuracy);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {phase === 'preparation' && (
        <Card>
          <CardHeader title={exercise.title} subtitle={exercise.description} />
          <CardBody>
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">📖 Anlama Testi</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Metin Uzunluğu:</strong> {exercise.wordCount} kelime
                  </p>
                  <p>
                    <strong>Soru Sayısı:</strong> {questions.length} adet
                  </p>
                  <p className="text-sm">
                    Metni dikkatlice okuyun ve ardından soruları cevaplayın.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold mb-2">💡 İpucu</h4>
                <p className="text-sm text-gray-700">
                  Metni hızlı ama dikkatli bir şekilde okuyun. Anlama yeteneğini test
                  edeceğiz.
                </p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={handleStartReading}>
              Okumaya Başla
            </Button>
          </CardFooter>
        </Card>
      )}

      {phase === 'reading' && (
        <Card>
          <CardHeader title="Metni Okuyun" subtitle="Dikkatlice okuduktan sonra devam edin" />
          <CardBody>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg text-gray-800 leading-relaxed">
                <p className="text-base">{exercise.text}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  Metni okuduğunuzda, aşağıdaki butona tıklayın.
                </p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={handleFinishReading} className="w-full">
              Okumayı Bitirdim
            </Button>
          </CardFooter>
        </Card>
      )}

      {phase === 'questions' && currentQuestionIdx < questions.length && (
        <Card>
          <CardHeader
            title="Anlama Soruları"
            subtitle={`Soru ${currentQuestionIdx + 1}/${questions.length}`}
          />
          <CardBody>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-gray-800">
                  {questions[currentQuestionIdx].question}
                </p>
              </div>

              <div className="space-y-3">
                {questions[currentQuestionIdx].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full p-4 rounded-lg font-semibold transition-all border-2 text-left ${
                      selectedAnswer === option
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full"
            >
              {currentQuestionIdx === questions.length - 1 ? 'Sonlandır' : 'Sonraki'}
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
                  {Math.round((answers.filter((a) => a.correct).length / answers.length) * 100)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Doğru Cevap</p>
                <p className="text-5xl font-bold text-green-600">
                  {answers.filter((a) => a.correct).length} / {answers.length}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-4">📊 Cevaplar</h4>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const userAnswer = answers.find((a) => a.questionId === q.id);
                  const isCorrect = userAnswer?.correct;

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg text-sm ${
                        isCorrect
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <p className="font-semibold mb-1">
                        {isCorrect ? '✅' : '❌'} Soru {idx + 1}
                      </p>
                      <p className="text-xs mb-1">Senin cevap: {userAnswer?.answer}</p>
                      {!isCorrect && (
                        <p className="text-xs">Doğru cevap: {q.correctAnswer}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Tavsiye</h4>
              <p className="text-sm text-gray-700">
                {Math.round((answers.filter((a) => a.correct).length / answers.length) * 100) >= 80
                  ? '🌟 Harika! Anlama yeteneğin çok iyi!'
                  : 'Yavaştan, ama daha dikkatli okumaya çalış.'}
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

export default ComprehensionComponent;
