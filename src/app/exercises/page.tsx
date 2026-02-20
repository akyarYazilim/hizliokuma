'use client';

import { useState } from 'react';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import { ALL_EXERCISES, EXERCISE_CATEGORIES, DIFFICULTY_LEVELS } from '@/constants/exercises';
import { Button } from '@/components/common/Button';

export default function ExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Filter exercises
  const filteredExercises = ALL_EXERCISES.filter(exercise => {
    const categoryMatch = !selectedCategory || exercise.category === selectedCategory;
    const difficultyMatch = !selectedDifficulty || exercise.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };

  const hasActiveFilters = selectedCategory || selectedDifficulty;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-400">Egzersizler</h1>
        <p className="text-lg text-gray-600">
          Hızlı okuma becerilerinizi geliştirmek için tasarlanmış çeşitli egzersizler.
          Zorluk seviyesini seçerek kendi temponuzda ilerleyebilirsiniz.
        </p>
      </section>

      {/* Filters */}
      <section className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-400">Filtreler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold text-gray-400 mb-3">Kategori</h3>
            <div className="space-y-2">
              {Object.entries(EXERCISE_CATEGORIES).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={key}
                    checked={selectedCategory === key}
                    onChange={() => setSelectedCategory(key)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">{label}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={!selectedCategory}
                  onChange={() => setSelectedCategory(null)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Tümü</span>
              </label>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h3 className="font-semibold text-gray-400 mb-3">Zorluk Seviyesi</h3>
            <div className="space-y-2">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={key}
                    checked={selectedDifficulty === key}
                    onChange={() => setSelectedDifficulty(key)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">{label}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value=""
                  checked={!selectedDifficulty}
                  onChange={() => setSelectedDifficulty(null)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Tümü</span>
              </label>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleResetFilters}
            >
              Filtreleri Temizle
            </Button>
            <span className="text-sm text-gray-600 self-center">
              {filteredExercises.length} egzersiz gösteriliyor
            </span>
          </div>
        )}
      </section>

      {/* Exercises Grid */}
      {filteredExercises.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-400">
            {hasActiveFilters
              ? `Filtrelenen Egzersizler (${filteredExercises.length})`
              : `Tüm Egzersizler (${filteredExercises.length})`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map(exercise => (
              <ExerciseCard 
                key={exercise.id} 
                exercise={exercise}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-800">
            Seçtiğiniz filtrelere uygun egzersiz bulunamadı.
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            className="mt-4"
            onClick={handleResetFilters}
          >
            Filtreleri Temizle
          </Button>
        </section>
      )}
    </div>
  );
}
