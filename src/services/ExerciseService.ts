/**
 * ExerciseService - Handles exercise logic and calculations
 * Follows the Service Layer pattern for business logic separation
 */

import { 
  Exercise, 
  ExerciseResult, 
  SpeedTestExercise,
  WordRecognitionExercise 
} from '@/types';
import { ALL_EXERCISES } from '@/constants/exercises';

class ExerciseService {
  /**
   * Get all available exercises
   */
  getAllExercises(): Exercise[] {
    return ALL_EXERCISES;
  }

  /**
   * Get exercise by ID
   */
  getExerciseById(id: string): Exercise | undefined {
    return ALL_EXERCISES.find(exercise => exercise.id === id);
  }

  /**
   * Get exercises by category
   */
  getExercisesByCategory(category: string): Exercise[] {
    return ALL_EXERCISES.filter(exercise => exercise.category === category);
  }

  /**
   * Get exercises by difficulty
   */
  getExercisesByDifficulty(difficulty: string): Exercise[] {
    return ALL_EXERCISES.filter(exercise => exercise.difficulty === difficulty);
  }

  /**
   * Calculate Words Per Minute (WPM)
   */
  calculateWPM(wordCount: number, timeInSeconds: number): number {
    if (timeInSeconds === 0) return 0;
    return Math.round((wordCount / timeInSeconds) * 60);
  }

  /**
   * Calculate accuracy percentage
   */
  calculateAccuracy(correctAnswers: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }

  /**
   * Score calculator for different exercise types
   */
  calculateScore(
    correctCount: number,
    totalCount: number,
    bonusMultiplier: number = 1
  ): number {
    const accuracy = this.calculateAccuracy(correctCount, totalCount);
    return Math.round(accuracy * bonusMultiplier);
  }

  /**
   * Create exercise result
   */
  createExerciseResult(
    exerciseId: string,
    userId: string,
    score: number,
    completionTime: number,
    additionalData?: { wordsPerMinute?: number; accuracy?: number }
  ): ExerciseResult {
    return {
      id: this.generateId(),
      exerciseId,
      userId,
      score,
      completionTime,
      wordsPerMinute: additionalData?.wordsPerMinute,
      accuracy: additionalData?.accuracy,
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get word count from text
   */
  getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Shuffle array (Fisher-Yates shuffle)
   */
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get random items from array
   */
  getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = this.shuffleArray(array);
    return shuffled.slice(0, count);
  }

  /**
   * Calculate reading level based on WPM
   */
  calculateReadingLevel(wpm: number): string {
    if (wpm < 100) return 'Başlangıç';
    if (wpm < 200) return 'Orta';
    if (wpm < 300) return 'İyi';
    if (wpm < 400) return 'Çok İyi';
    return 'Uzman';
  }

  /**
   * Get reading time estimate for text
   */
  getReadingTimeEstimate(wordCount: number, averageWPM: number = 200): number {
    return Math.ceil((wordCount / averageWPM) * 60); // in seconds
  }
}

// Singleton instance
export const exerciseService = new ExerciseService();

export default ExerciseService;
