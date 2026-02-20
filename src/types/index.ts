// Exercise Related Types
export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  duration: number; // in seconds
  icon: string;
}

export type ExerciseCategory = 
  | 'word-recognition' 
  | 'speed-test' 
  | 'comprehension' 
  | 'focus-training' 
  | 'peripheral-vision';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Exercise Results
export interface ExerciseResult {
  id: string;
  exerciseId: string;
  userId: string;
  score: number;
  wordsPerMinute?: number;
  accuracy?: number; // percentage
  completionTime: number; // in seconds
  completedAt: string; // ISO date
}

// Exercise State
export interface ExerciseState {
  currentIndex: number;
  isRunning: boolean;
  score: number;
  timeRemaining: number;
  totalTime: number;
}

// User Progress
export interface UserProgress {
  userId: string;
  exerciseId: string;
  lastAttemptDate: string;
  bestScore: number;
  totalAttempts: number;
  averageScore: number;
}

// Word Recognition Exercise
export interface WordRecognitionExercise extends Exercise {
  words: string[];
  targetWord: string;
  numberOfChoices: number;
}

// Speed Reading Test
export interface SpeedTestExercise extends Exercise {
  text: string;
  wordCount: number;
  comprehensionQuestions?: ComprehensionQuestion[];
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

// Peripheral Vision Exercise
export interface PeripheralVisionExercise extends Exercise {
  gridSize: number; // 3x3, 4x4, etc.
  targetCount: number;
  displayDuration: number; // milliseconds
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
