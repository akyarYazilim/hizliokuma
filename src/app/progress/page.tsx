'use client';

import { useState, useEffect } from 'react';
import { ExerciseResult, Exercise } from '@/types';
import { storageService } from '@/services/StorageService';
import { exerciseService } from '@/services/ExerciseService';
import { Card, CardHeader, CardBody } from '@/components/common/Card';
import { formatSeconds, getScoreBadge, getWPMLevel } from '@/utils/formatters';
import { ALL_EXERCISES } from '@/constants/exercises';

export default function ProgressPage() {
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedResults = storageService.getItem<ExerciseResult[]>('results') || [];
    setResults(loadedResults.sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    ));
    setIsLoaded(true);
  }, []);

  const getExerciseTitle = (exerciseId: string): string => {
    const exercise = ALL_EXERCISES.find(e => e.id === exerciseId);
    return exercise?.title || 'Bilinmeyen Egzersiz';
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.exerciseId]) {
      acc[result.exerciseId] = [];
    }
    acc[result.exerciseId].push(result);
    return acc;
  }, {} as Record<string, ExerciseResult[]>);

  const calculateStats = (exerciseResults: ExerciseResult[]) => {
    const totalAttempts = exerciseResults.length;
    const averageScore = Math.round(
      exerciseResults.reduce((sum, r) => sum + r.score, 0) / totalAttempts
    );
    const bestScore = Math.max(...exerciseResults.map(r => r.score));
    const averageWPM = exerciseResults
      .filter(r => r.wordsPerMinute)
      .reduce((sum, r) => sum + (r.wordsPerMinute || 0), 0) / 
      exerciseResults.filter(r => r.wordsPerMinute).length || 0;

    return {
      totalAttempts,
      averageScore,
      bestScore,
      averageWPM: Math.round(averageWPM),
    };
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardBody>
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </CardBody>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader 
          title="İlerleme"
          subtitle="Henüz hiçbir egzersiz tamamlanmadı"
        />
        <CardBody>
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-600">
              İlerlemenizi görmek için bir egzersiz tamamlayın.
            </p>
            <a 
              href="/exercises"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Egzersizlere Git
            </a>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-400">İlerleme</h1>
        <p className="text-lg text-gray-600">
          Tüm egzersiz sonuçlarınızı ve istatistiklerinizi izleyin.
        </p>
      </section>

      {/* Overall Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-b-4 border-blue-600">
          <CardBody>
            <p className="text-sm text-gray-600">Toplam Denemeler</p>
            <p className="text-3xl font-bold text-blue-600">{results.length}</p>
          </CardBody>
        </Card>

        <Card className="bg-green-50 border-b-4 border-green-600">
          <CardBody>
            <p className="text-sm text-gray-600">Ortalama Skor</p>
            <p className="text-3xl font-bold text-green-600">
              {Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-purple-50 border-b-4 border-purple-600">
          <CardBody>
            <p className="text-sm text-gray-600">En Yüksek Skor</p>
            <p className="text-3xl font-bold text-purple-600">
              {Math.max(...results.map(r => r.score))}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-orange-50 border-b-4 border-orange-600">
          <CardBody>
            <p className="text-sm text-gray-600">Egzersiz Türü</p>
            <p className="text-3xl font-bold text-orange-600">
              {Object.keys(groupedResults).length}
            </p>
          </CardBody>
        </Card>
      </section>

      {/* Exercise-wise Progress */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-400">Egzersiz Başına İlerleme</h2>

        <div className="space-y-6">
          {Object.entries(groupedResults).map(([exerciseId, exerciseResults]) => {
            const stats = calculateStats(exerciseResults);
            const badge = getScoreBadge(stats.bestScore);

            return (
              <Card key={exerciseId}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-400">
                        {getExerciseTitle(exerciseId)}
                      </h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-${badge.color}-100 text-${badge.color}-800`}>
                      {badge.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Deneme Sayısı</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalAttempts}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ort. Skor</p>
                      <p className="text-2xl font-bold text-green-600">{stats.averageScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">En İyi</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.bestScore}</p>
                    </div>
                    {stats.averageWPM > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Ort. WPM</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.averageWPM}</p>
                      </div>
                    )}
                  </div>

                  {/* Recent Attempts */}
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-400 mb-3">Son Girisimler</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {exerciseResults.slice(0, 5).map((result) => (
                        <div key={result.id} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded">
                          <div>
                            <span className="font-semibold text-gray-400">{result.score} puan</span>
                            {result.wordsPerMinute && (
                              <span className="text-gray-600 ml-2">({result.wordsPerMinute} WPM)</span>
                            )}
                          </div>
                          <span className="text-gray-500">
                            {new Date(result.completedAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Recent Results */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-400">Son Sonuçlar</h2>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-gray-400">Egzersiz</th>
                  <th className="text-left p-3 font-semibold text-gray-400">Skor</th>
                  <th className="text-left p-3 font-semibold text-gray-400">Zaman</th>
                  <th className="text-left p-3 font-semibold text-gray-400">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 10).map((result) => (
                  <tr key={result.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{getExerciseTitle(result.exerciseId)}</td>
                    <td className="p-3">
                      <span className="font-bold text-blue-600">{result.score}</span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {result.completionTime}s
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(result.completedAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
