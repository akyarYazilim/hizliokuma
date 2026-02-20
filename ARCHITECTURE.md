# ARCHITECTURE.md - Sistem Mimarisi

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Katman Mimarisi](#katman-mimarisi)
3. [Design Patterns](#design-patterns)
4. [Veri Akışı](#veri-akışı)
5. [Component Hiyerarşisi](#component-hiyerarşisi)
6. [Services](#services)
7. [State Management](#state-management)

## Genel Bakış

Hızlı Okuma platformu, **Clean Architecture** ve **Layered Architecture** prensiplerini takip eden, ölçeklenebilir ve bakımının kolay olduğu bir sistemdir.

```
User Interface Layer
        ↓
Page/Container Layer
        ↓
Component Layer
        ↓
Custom Hooks Layer
        ↓
Service Layer (Business Logic)
        ↓
Data/Storage Layer
```

## Katman Mimarisi

### 1. **Presentation Layer (Sunum Katmanı)**

#### Pages (`src/app/`)
- `page.tsx` - Ana sayfa (Home)
- `exercises/page.tsx` - Egzersiz listesi
- `exercises/[id]/page.tsx` - Bireysel egzersiz
- `progress/page.tsx` - İlerleme takibi

**Sorumlulukları:**
- URL routing
- Page layout
- Props drilling
- User interactions

#### Components (`src/components/`)

**common/** - Genel amaçlı bileşenler
- `Button.tsx` - Çok amaçlı buton
- `Card.tsx` - Kart bileşenleri (Card, CardHeader, CardBody, CardFooter)
- `Timer.tsx` - Zaman sayıcı
- `ProgressBar.tsx` - İlerleme göstergesi

**exercises/** - Egzersiz bileşenleri
- `ExerciseCard.tsx` - Egzersiz kartı
- `SpeedReadingExercise.tsx` - Hız okuma egzersizi
- `WordRecognitionExercise.tsx` - Kelime tanıma egzersizi
- `PeripheralVisionExercise.tsx` - Çevre görüş egzersizi

**layout/** - Layout bileşenleri
- `Header.tsx` - Üst navigasyon
- `Footer.tsx` - Alt bilgi

### 2. **Business Logic Layer (İş Mantığı Katmanı)**

#### Services (`src/services/`)

**ExerciseService.ts**
```typescript
class ExerciseService {
  // Egzersiz CRUD
  getAllExercises(): Exercise[]
  getExerciseById(id: string): Exercise
  getExercisesByCategory(category: string): Exercise[]
  getExercisesByDifficulty(difficulty: string): Exercise[]
  
  // Hesaplamalar
  calculateWPM(wordCount, timeInSeconds): number
  calculateAccuracy(correctAnswers, totalQuestions): number
  calculateScore(correctCount, totalCount, bonusMultiplier): number
  
  // Yardımcı metodlar
  getWordCount(text): number
  shuffleArray<T>(array): T[]
  getRandomItems<T>(array, count): T[]
  calculateReadingLevel(wpm): string
  getReadingTimeEstimate(wordCount, averageWPM): number
}
```

**StorageService.ts**
```typescript
class StorageService {
  setItem<T>(key, value): void
  getItem<T>(key, defaultValue?): T | null
  removeItem(key): void
  clear(): void
  hasItem(key): boolean
}
```

**Ayrılma Nedenleri:**
- ExerciseService: Tüm egzersiz mantığı ve hesaplamalar
- StorageService: Tüm veri persistence işlemleri

### 3. **State Management Layer (Durum Yönetimi)**

#### Custom Hooks (`src/hooks/`)

**useExerciseTimer.ts**
- Timer state yönetimi
- Otomatik countdown
- Progress tracking

**useExerciseState.ts**
- Egzersiz durumu yönetimi
- Score tracking
- Item navigation

**useLocalStorage.ts**
- localStorage wrapper
- Automatic persistence
- Type-safe storage operations

### 4. **Type & Constant Layer**

#### Types (`src/types/index.ts`)
Tüm TypeScript interfaces ve types:
```typescript
- Exercise (base interface)
- ExerciseResult
- ExerciseState
- UserProgress
- ComprehensionQuestion
- ApiResponse<T>
```

#### Constants (`src/constants/exercises.ts`)
- Egzersiz veri tanımlamaları
- Kategori ve zorluk seviyeleri
- STRING constants

### 5. **Utility Layer**

#### Formatters (`src/utils/formatters.ts`)
- `formatSeconds(seconds)` → "MM:SS"
- `formatDuration(seconds)` → "3m"
- `formatNumber(num, decimals)` → "99.99"
- `truncateText(text, length)` → "text..."
- `getScoreBadge(score)` → {label, color}
- `getWPMLevel(wpm)` → "İyi (200-300 WPM)"

#### Validation (`src/utils/validation.ts`)
- `isValidEmail(email)` → boolean
- `isValidUrl(url)` → boolean
- `isEmpty(value)` → boolean
- Type guards: `isString()`, `isNumber()`, `isArray()`

## Design Patterns

### 1. Service Layer Pattern
```typescript
// Business logic'i components'ten ayırır
ExerciseService → Exercise Logic
StorageService → Data Access Logic
```

### 2. Component Pattern
```typescript
// Reusable, composable components
<Button variant="primary" size="lg" />
<Card>
  <CardHeader title="" />
  <CardBody />
  <CardFooter />
</Card>
```

### 3. Custom Hooks Pattern
```typescript
// Logic reuse ve state management
const { timeRemaining, isRunning, start, pause } = useExerciseTimer(...)
const { score, updateScore, reset } = useExerciseState(...)
const [state, setState, isLoaded] = useLocalStorage(key, initialValue)
```

### 4. Singleton Pattern
```typescript
// Service instances
export const exerciseService = new ExerciseService()
export const storageService = new StorageService()
```

### 5. Factory Pattern
```typescript
// ExerciseService ile exercise oluşturma
createExerciseResult(exerciseId, userId, score, time)
```

### 6. Repository Pattern
```typescript
// StorageService data access'i encapsulate eder
setItem(), getItem(), removeItem()
```

### 7. Observer Pattern
```typescript
// React State Management
useState() → reactive state changes
useEffect() → side effects
```

## Veri Akışı

### Tipik Exercize Flow

```
1. User clicks "Başla" button on HomePage
        ↓
2. Route to /exercises/[id]/page.tsx
        ↓
3. Load Exercise from ExerciseService.getExerciseById(id)
        ↓
4. Render appropriate Exercise Component
   - SpeedReadingExercise
   - WordRecognitionExercise
   - PeripheralVisionExercise
        ↓
5. Exercise Component:
   - Manages state with custom hooks
   - Calls onComplete(results)
        ↓
6. Page component:
   - Creates ExerciseResult via ExerciseService
   - Saves to localStorage via StorageService
   - Shows completion screen
        ↓
7. User can:
   - View results
   - Retry exercise
   - Go back to exercises
```

### Storage Flow

```
Component State
        ↓
useLocalStorage Hook
        ↓
StorageService.setItem()
        ↓
localStorage (JSON serialized)
        ↓
On load: localStorage → StorageService.getItem() → Hook → Component
```

## Component Hiyerarşisi

```
<RootLayout>
  <Header>
    <nav>...</nav>
  </Header>
  <main>
    <HomePage>
      <Hero />
      <Features />
      <ExerciseCard[] />
    </HomePage>
    
    <ExercisesPage>
      <Filters />
      <ExerciseCard[] />
    </ExercisesPage>
    
    <ExercisePage>
      <SpeedReadingExercise>
        <Card>
          <CardHeader />
          <ReadingPhase />
          <QuestionsPhase />
        </Card>
      </SpeedReadingExercise>
    </ExercisePage>
    
    <ProgressPage>
      <StatsCards />
      <ExerciseStats[] />
      <ResultsTable />
    </ProgressPage>
  </main>
  <Footer>
    <links> ... </links>
  </Footer>
</RootLayout>
```

## Services

### ExerciseService

**Scope:** Tüm egzersiz ile ilgili işlemler
**Instantiation:** Singleton (export const exerciseService = ...)
**Usage:**
```typescript
// Egzersiz getirme
const exercise = exerciseService.getExerciseById('speed-test-1')
const exercises = exerciseService.getExercisesByCategory('speed-test')

// Hesaplamalar
const wpm = exerciseService.calculateWPM(300, 60) // 300 words in 60 seconds
const accuracy = exerciseService.calculateAccuracy(8, 10) // 80%

// Sonuç oluşturma
const result = exerciseService.createExerciseResult(
  'exercise-id',
  'user-id',
  score,
  completionTime,
  { wordsPerMinute: 250, accuracy: 85 }
)
```

### StorageService

**Scope:** Tüm localStorage işlemleri
**Instantiation:** Singleton
**Key prefix:** 'hizliokuma_' (otomatik)
**Usage:**
```typescript
// Set
storageService.setItem('results', resultsArray)

// Get with default
const results = storageService.getItem('results', [])

// Check existence
if (storageService.hasItem('results')) { ... }

// Remove
storageService.removeItem('results')

// Clear all
storageService.clear()
```

## State Management

### React Hooks Strategy

```
Global State Issues:
- Home Page: Static data (ALL_EXERCISES)
  → Use: Constants (EXERCISE_CATEGORIES, DIFFICULTY_LEVELS)

- Exercise Page: Active exercise, answers, score
  → Use: Component useState + Custom Hooks
  → Persist: localStorage via StorageService

- Progress Page: Historical results
  → Use: localStorage via StorageService
  → Display: Sorting & filtering in component

- Navigation State: URL params
  → Use: Next.js routing params
```

### Custom Hook Patterns

**useExerciseTimer** - Dedicated timer logic
```typescript
const {
  timeRemaining,    // Current seconds
  isRunning,        // Timer state
  start,            // Start function
  pause,            // Pause function
  reset,            // Reset function
  progress          // 0-100 percentage
} = useExerciseTimer({ initialTime: 60 })
```

**useExerciseState** - Exercise state management
```typescript
const {
  currentIndex,     // Current item
  score,            // Current score
  isRunning,        // Exercise running state
  updateScore,      // Add points
  nextItem,         // Move to next
  reset             // Reset exercise
} = useExerciseState({ totalTime: 300 })
```

**useLocalStorage** - Persistent state
```typescript
const [value, setValue, isLoaded] = useLocalStorage(
  'results',
  defaultArray
)
```

## Veri Kalıcılığı

### localStorage Strategy

```
Key Format: hizliokuma_<key>

Stored Data:
- hizliokuma_results: ExerciseResult[]
- hizliokuma_userProgress: UserProgress[]
- (Future: user settings, preferences)

Initialization:
1. Check localStorage for existing data
2. Fall back to default values if not found
3. Handle JSON parsing errors gracefully
4. Auto-sync on state changes
```

## Genişletilebilirlik

### Yeni Egzersiz Ekleme

1. **Type tanımı** (`src/types/index.ts`):
```typescript
export interface NewExerciseType extends Exercise {
  // Custom properties
}
```

2. **Data tanımı** (`src/constants/exercises.ts`):
```typescript
export const NEW_EXERCISE: NewExerciseType = { ... }
```

3. **Component** (`src/components/exercises/NewExercise.tsx`):
```typescript
export const NewExerciseComponent: React.FC<Props> = ({ ... }) => { ... }
```

4. **Page integration** (`src/app/exercises/[id]/page.tsx`):
```typescript
if (exercise.category === 'new-type') {
  return <NewExerciseComponent exercise={exercise} onComplete={...} />
}
```

### Yeni Service Ekleme

1. Create: `src/services/NewService.ts`
2. Export singleton: `export const newService = new NewService()`
3. Use in components/pages

## Performance Considerations

1. **Component Memoization**: Heavy components `React.memo` kullanabilir
2. **Hook Dependencies**: useEffect dependencies optimize edilmiş
3. **Lazy Loading**: Not implemented (scope dışı)
4. **Image Optimization**: Emoji icons (no optimization needed)

## Security Considerations

1. **localStorage**: Client-side only, not for sensitive data
2. **Input Validation**: storageService error handling
3. **Type Safety**: TypeScript prevents type mismatches
4. **XSS Protection**: Used through React's built-in escaping

---

**Last Updated:** February 2026
