import { Exercise, WordRecognitionExercise, SpeedTestExercise, PeripheralVisionExercise } from '@/types';

// Word Recognition Exercise
export const WORD_RECOGNITION_EXERCISE: WordRecognitionExercise = {
  id: 'word-recognition-1',
  title: 'Kelime Tanıma',
  description: 'Hızlı tahrifleri tanır ve doğru kelimeyi seçin',
  category: 'word-recognition',
  difficulty: 'beginner',
  duration: 60,
  icon: '👁️',
  words: [
    'kitap', 'kalem', 'masa', 'sandalye', 'kapı', 'pencere', 'ışık', 'gölge',
    'ses', 'hava', 'su', 'ateş', 'doğa', 'insanlar', 'hayvanlar', 'bitki',
    'renk', 'şekil', 'boyut', 'ağırlık'
  ],
  targetWord: 'kitap',
  numberOfChoices: 4,
};

// Speed Reading Test
export const SPEED_TEST_EXERCISE: SpeedTestExercise = {
  id: 'speed-test-1',
  title: 'Hız Okuma Testi',
  description: 'Bir metni okuyun ve anlama yeteneğinizi test edin',
  category: 'speed-test',
  difficulty: 'intermediate',
  duration: 300,
  icon: '⚡',
  text: `Teknoloji, günümüz dünyasında hızla gelişmekte ve hayatımızın her alanını etkilemektedir. 
  İnternet, mobil cihazlar ve yapay zeka gibi yenilikler, iş dünyası, eğitim ve sosyal hayatı köklü şekilde değiştirmiştir.
  Bilgisayarlar ve internet olmadan modern yaşamı hayal etmek artık neredeyse imkansız hale gelmiştir.
  Ancak bu hızlı gelişme beraberinde bazı zorlukları da getirmiştir. Siber güvenlik, veri gizliliği ve dijital bağımlılık,
  günümüzün önemli sorunları haline gelmiştir. Toplum olarak bu zorlukları aşarken, teknolojinin faydalarından da yararlanmalıyız.
  Dijital okuryazarlık ve teknoloji eğitimi, geleceğin nesilleri için elzem hale gelmiştir.`,
  wordCount: 0, // Will be calculated
  comprehensionQuestions: [
    {
      id: 'q1',
      question: 'Metne göre, teknoloji hangi alanlarda etkili olmuştur?',
      options: [
        'Sadece İnternet alanında',
        'İş, eğitim ve sosyal hayatta',
        'Sadece mobil cihazlarda',
        'Yalnızca yapay zeka alanında'
      ],
      correctAnswer: 'İş, eğitim ve sosyal hayatta',
    },
    {
      id: 'q2',
      question: 'Metinde bahsedilen sorunlar nelerdir?',
      options: [
        'Düşük yazılım kalitesi',
        'Siber güvenlik, veri gizliliği ve dijital bağımlılık',
        'İnternet yavaşlığı',
        'Bilgisayar virüsleri'
      ],
      correctAnswer: 'Siber güvenlik, veri gizliliği ve dijital bağımlılık',
    },
  ],
};

// Focus Training Exercise
export const FOCUS_TRAINING_EXERCISE: Exercise = {
  id: 'focus-training-1',
  title: 'Fokus Antrenmanı',
  description: 'Dikkat yeteneğinizi geliştirin, hızla akan metinle odaklanma pratiği yapın',
  category: 'focus-training',
  difficulty: 'beginner',
  duration: 120,
  icon: '🎯',
};

// Comprehension Exercise
export const COMPREHENSION_EXERCISE: Exercise = {
  id: 'comprehension-1',
  title: 'Anlama Becerisi',
  description: 'Hızla okuduğunuz metni anlama yeteneğinizi test edin',
  category: 'comprehension',
  difficulty: 'advanced',
  duration: 240,
  icon: '📚',
};

// Peripheral Vision Exercise
export const PERIPHERAL_VISION_EXERCISE: PeripheralVisionExercise = {
  id: 'peripheral-vision-1',
  title: 'Çevre Görüş',
  description: 'Çevre görmek yeteneğinizi geliştirin, merkezcil görüşü genişletin',
  category: 'peripheral-vision',
  difficulty: 'intermediate',
  duration: 180,
  icon: '👀',
  gridSize: 4,
  targetCount: 3,
  displayDuration: 2000,
};

// All Exercises Array
export const ALL_EXERCISES: Exercise[] = [
  WORD_RECOGNITION_EXERCISE,
  SPEED_TEST_EXERCISE,
  FOCUS_TRAINING_EXERCISE,
  COMPREHENSION_EXERCISE,
  PERIPHERAL_VISION_EXERCISE,
];

export const EXERCISE_CATEGORIES = {
  'word-recognition': 'Kelime Tanıma',
  'speed-test': 'Hız Testi',
  'comprehension': 'Anlama',
  'focus-training': 'Fokus Antrenmanı',
  'peripheral-vision': 'Çevre Görüş',
} as const;

export const DIFFICULTY_LEVELS = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
} as const;
