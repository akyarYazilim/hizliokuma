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
  | 'peripheral-vision'
  | 'speedreader'
  | 'smooth-pursuit'
  | 'advanced-eye-tracking';

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

// Speed Reader Exercise (RSVP - Rapid Serial Visual Presentation)
export interface SpeedReaderExercise extends Exercise {
  text: string;
  wordCount: number;
  wpmOptions: number[]; // Default WPM speeds to choose from
  comprehensionQuestions: ComprehensionQuestion[];
}

// Smooth Pursuit Exercise (Eye Tracking)
export interface SmoothPursuitExercise extends Exercise {
  speeds: number[]; // Available speed levels (pixels per second)
  targetSize: number; // Size of the target circle in pixels
  trackingArea: { width: number; height: number }; // Viewport dimensions
}

// Advanced Eye Tracking Exercise (Dynamic Target with patterns)
export interface AdvancedEyeTrackingExercise extends Exercise {
  speeds: number[]; // Available speed levels
  sizeMultipliers: number[]; // Size change rates (1 = normal, 0.5-1.5 typical)
  patterns: Array<'circle' | 'zigzag' | 'figure8' | 'spiral' | 'square'>; // Movement patterns
  targetSize: number; // Base size
  trackingArea: { width: number; height: number };
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
