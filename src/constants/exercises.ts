import { Exercise, WordRecognitionExercise, SpeedTestExercise, PeripheralVisionExercise, SpeedReaderExercise, SmoothPursuitExercise, AdvancedEyeTrackingExercise, RapidWordRecognitionExercise } from '@/types';

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

// Speed Reader Exercise (RSVP - Rapid Serial Visual Presentation)
export const SPEEDREADER_EXERCISE: SpeedReaderExercise = {
  id: 'speedreader-1',
  title: 'Speed Reader (RSVP)',
  description: 'Hızlı seri görsel sunum tekniği ile okuma hızınızı arttırın',
  category: 'speedreader',
  difficulty: 'intermediate',
  duration: 300,
  icon: '⚡📖',
  text: `Hızlı okuma, bilgi çağında önemli bir beceridir. Günümüzde insanlar her gün çok fazla metinle karşı karşıya gelir.
  İnternet, sosyal medya, e-mails ve online haberler, bizi sürekli bir bilgi akışının ortasında bırakır.
  Bu nedenle, etkili bir şekilde hızlı okuma yapabilmek, modern yaşamda kritik bir yeterlik haline gelmiştir.
  Hızlı okuma teknikleri, özellikle öğrenciler, profesyoneller ve araştırmacılar için değerlidir.
  RSVP (Rapid Serial Visual Presentation) yöntemi, ekranda tek bir kelimeyi göstererek, göz hareketini azaltır ve
  sözde geri adımlamayı (regression) ortadan kaldırır. Bu şekilde, beyin daha verimli bir şekilde bilgiyi işleyebilir.
  Hızlı okuma pratikleri yaparak, dakikada çok daha fazla kelime okuyabilirsiniz, aynı zamanda anlama yeteneğinizi koruyor olursunuz.`,
  wordCount: 0,
  wpmOptions: [300, 400, 500, 600],
  comprehensionQuestions: [
    {
      id: 'q1',
      question: 'RSVP yöntemi hangi sorunu çözmek için kullanılır?',
      options: [
        'Yazı boyutunu ayarlamak',
        'Göz hareketini azaltmak ve geri adımlamayı ortadan kaldırmak',
        'Işık parlaklığını kontrol etmek',
        'Metin rengini değiştirmek'
      ],
      correctAnswer: 'Göz hareketini azaltmak ve geri adımlamayı ortadan kaldırmak',
    },
    {
      id: 'q2',
      question: 'Hızlı okuma hangi mesleklerdeki kişiler için önemli olabilir?',
      options: [
        'Sadece öğrenciler için',
        'Yalnızca yazarlar için',
        'Öğrenciler, profesyoneller ve araştırmacılar için',
        'Hiç kimse için gerekli değil'
      ],
      correctAnswer: 'Öğrenciler, profesyoneller ve araştırmacılar için',
    },
  ],
};

// Smooth Pursuit Exercise (Eye Tracking)
export const SMOOTH_PURSUIT_EXERCISE: SmoothPursuitExercise = {
  id: 'smooth-pursuit-1',
  title: 'Smooth Pursuit (Göz Takibi)',
  description: 'Hareket eden hedefi takip ederek göz kontrol ve hız yeteneğinizi geliştirin',
  category: 'smooth-pursuit',
  difficulty: 'intermediate',
  duration: 120,
  icon: '🎯',
  speeds: [2, 4, 6], // pixels per frame at ~60fps
  targetSize: 30, // 30px diameter circle
  trackingArea: { width: 800, height: 600 },
};

// Advanced Eye Tracking Exercise (Dynamic Target with patterns)
export const ADVANCED_EYE_TRACKING_EXERCISE: AdvancedEyeTrackingExercise = {
  id: 'advanced-eye-tracking-1',
  title: 'İleri Göz Takibi (Dinamik)',
  description: 'Boyutu ve hızı değişen topu farklı desenlerde takip ederek göz yeteneğinizi maksimize edin',
  category: 'advanced-eye-tracking',
  difficulty: 'advanced',
  duration: 180,
  icon: '🔄',
  speeds: [2, 4, 6, 8],
  sizeMultipliers: [0.8, 1.0, 1.2],
  patterns: ['circle', 'zigzag', 'figure8', 'spiral', 'square'],
  targetSize: 25,
  trackingArea: { width: 800, height: 600 },
};

// Word pool for Rapid Word Recognition Exercise
const RAPID_WORD_POOL = [
  // Teknoloji (Technology)
  'bilgisayar', 'yazılım', 'donanım', 'internet', 'telefon', 'ekran', 'klavye', 'fare', 'modem', 'router',
  'server', 'bulut', 'veri', 'şifre', 'güvenlik', 'ağ', 'program', 'kod', 'sistem', 'uygulama',
  // Eğitim (Education)
  'okul', 'üniversite', 'öğretmen', 'öğrenci', 'sınıf', 'ders', 'kitap', 'test', 'sınav', 'diploma',
  'eğitim', 'bilgi', 'öğrenme', 'kuş', 'kalem', 'defter', 'kütüphane', 'araştırma', 'akademi', 'seminer',
  // Sağlık (Health)
  'doktor', 'hastane', 'ilaç', 'sağlık', 'hastalık', 'tedavi', 'eczane', 'hasta', 'nabız', 'göz',
  'kulak', 'diş', 'vücut', 'kalp', 'beyin', 'pulmoner', 'tıp', 'cerrahi', 'aşı', 'antiyotik',
  // Spor (Sports)
  'futbol', 'basketbol', 'tenis', 'voleybol', 'atlet', 'spor', 'oyuncu', 'maç', 'takım', 'hakem',
  'stadyum', 'antrenör', 'antrenması', 'rekor', 'medal', 'şampiyonluk', 'lig', 'kupa', 'skor', 'gol',
  // Sanat (Art)
  'resim', 'müzik', 'sanat', 'sahne', 'tiyatro', 'sinema', 'film', 'oyuncu', 'şarkı', 'dans',
  'koreografi', 'tasarım', 'heykel', 'ressam', 'sanatçı', 'beste', 'melodi', 'ritim', 'konsert', 'gösteri',
  // Doğa (Nature)
  'ağaç', 'çiçek', 'bitki', 'hayvan', 'kuş', 'balık', 'böcek', 'çiçek', 'Orman', 'dağ',
  'river', 'göl', 'deniz', 'okyanus', 'küşş', 'havası', 'toprak', 'kaya', 'kumlu', 'çal'
];

// Rapid Word Recognition Exercise
export const RAPID_WORD_RECOGNITION_EXERCISE: RapidWordRecognitionExercise = {
  id: 'rapid-word-recognition-1',
  title: 'Hızlı Kelime Tanıma',
  description: '100 kelimeden rastgele seçilmiş kelimeleri hızlıca gösterilecek, tanımaya çalışın',
  category: 'rapid-word-recognition',
  difficulty: 'intermediate',
  duration: 180,
  icon: '⚡📚',
  words: RAPID_WORD_POOL,
  displayDuration: 800, // 800ms gösterim süresi
  roundCount: 20, // 20 kelime test et
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
  SPEEDREADER_EXERCISE,
  SMOOTH_PURSUIT_EXERCISE,
  ADVANCED_EYE_TRACKING_EXERCISE,
  RAPID_WORD_RECOGNITION_EXERCISE,
  PERIPHERAL_VISION_EXERCISE,
];

export const EXERCISE_CATEGORIES = {
  'word-recognition': 'Kelime Tanıma',
  'speed-test': 'Hız Testi',
  'comprehension': 'Anlama',
  'focus-training': 'Fokus Antrenmanı',
  'speedreader': 'Speed Reader (RSVP)',
  'smooth-pursuit': 'Smooth Pursuit (Göz Takibi)',
  'advanced-eye-tracking': 'İleri Göz Takibi',
  'rapid-word-recognition': 'Hızlı Kelime Tanıma',
  'peripheral-vision': 'Çevre Görüş',
} as const;

export const DIFFICULTY_LEVELS = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
} as const;
