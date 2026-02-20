# Hızlı Okuma Platformu - Geliştirme Rehberi

Bu dosya, bu workspace'deki geliştirme için Copilot için özel talimatları içerir.

## Proje Bilgisi

- **Adı**: Hızlı Okuma Platformu
- **Dil**: TypeScript + React
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Durum**: Production Ready ✅

## Mimari Özet

### Katmanlar
1. **Pages** (`src/app/`) - Next.js rotaları
2. **Components** (`src/components/`) - React UI components
3. **Services** (`src/services/`) - Business logic
4. **Hooks** (`src/hooks/`) - Custom React hooks
5. **Types** (`src/types/`) - TypeScript definitions
6. **Utils** (`src/utils/`) - Helper functions

### Tasarım Desenleri
- Service Layer Pattern (ExerciseService, StorageService)
- Component Pattern (Reusable components)
- Custom Hooks Pattern
- Singleton Pattern (Service instances)
- Repository Pattern (StorageService)
- Factory Pattern
- Observer Pattern (React state)

## Egzersizler

5 egzersiz türü mevcuttur:

1. **Speed Test** (`/exercises/speed-test-1`)
   - Okuma hızı ve anlama testi
   - Metrikleri: WPM, Accuracy %

2. **Word Recognition** (`/exercises/word-recognition-1`)
   - 10 turda kelime bulma
   - Puan: +10 doğru, -5 yanlış

3. **Focus Training** (`/exercises/focus-training-1`)
   - Konsantrasyon egzersizi

4. **Comprehension** (`/exercises/comprehension-1`)
   - İleri seviye anlama testi

5. **Peripheral Vision** (`/exercises/peripheral-vision-1`)
   - Grid tabanlı hedef bulma

## Dosya Organizasyonu Best Practices

```
src/
├── app/          → Pages should use dynamic routes
├── components/   → Keep components focused and small
├── services/     → Singleton services for business logic
├── hooks/        → Custom hooks for state management
├── types/        → All TypeScript interfaces
├── constants/    → Static data and configurations
└── utils/        → Pure utility functions
```

## Kodlama Standartları

### TypeScript
- ✅ Strict mode enabled
- ✅ No `any` types allowed
- ✅ Full type safety required
- ✅ Interfaces for most types

### React
- Functional components only
- Use hooks for state management
- Custom hooks for reusable logic
- Props interface for component props
- Memoization for performance (React.memo, useMemo)

### Naming Conventions
- Components: PascalCase (Button, ExerciseCard)
- Functions: camelCase (handleClick, calculateWPM)
- Constants: UPPER_SNAKE_CASE (ALL_EXERCISES)
- Files: Match export name (Button.tsx)

## Veri Yönetimi

### localStorage Strategy
- Prefix: `hizliokuma_`
- StorageService handles all access
- Automatic serialization
- Error handling included

### State Management
- useState for component state
- useEffect for side effects
- Custom hooks for shared logic
- Context API (if needed in future)

## Stil Rehberi

### Tailwind CSS
- Use pre-made components (Button, Card, etc.)
- Consistent spacing (gap-2, p-4, m-6)
- Color scheme: Blue primary (#2563eb)
- Responsive: Mobile-first approach
- Dark mode: Not implemented (future enhancement)

## Yeni Kod Ekleme Rehberi

### Yeni Egzersiz
1. Type'ı `src/types/index.ts` ekle
2. Verileri `src/constants/exercises.ts` ekle
3. Component oluştur `src/components/exercises/`
4. Page'de render et `src/app/exercises/[id]/page.tsx`

### Yeni Sayfa
1. Route oluştur (`src/app/new-page/page.tsx`)
2. Components kullan
3. Services'den data al
4. Header/Footer otomatik include

### Yeni Service
1. `src/services/NewService.ts` oluştur
2. Export singleton instance
3. Full docs ve comments ekle

### Yeni Utility
1. `src/utils/newHelper.ts` oluştur
2. Pure functions
3. Export for use

## Testing & QA

### Pre-commit
- ESLint checks
- TypeScript compilation
- No console errors
- No warnings

### Build Checklist
```bash
npm run lint      # Code quality
npm run build     # Compilation
# Then test manually
```

## Performance Optimization

- Code splitting for routes (automatic with Next.js)
- Image optimization (emoji icons = no optimization needed)
- Component memoization (React.memo if needed)
- useCallback for event handlers (if needed)
- useMemo for expensive calculations (if needed)

## Documentation Standards

- File headers with purpose
- Function JSDoc comments
- Type descriptions
- Usage examples in complex code
- README for major features

## Common Patterns

### Service Usage
```typescript
import { exerciseService } from '@/services/ExerciseService'

const exercise = exerciseService.getExerciseById(id)
```

### Custom Hook Usage
```typescript
import { useExerciseTimer } from '@/hooks/useExerciseTimer'

const { timeRemaining, isRunning, start, pause } = useExerciseTimer({...})
```

### Component Creation
```typescript
interface ComponentProps {
  prop1: string
  prop2?: number
  onCallback?: () => void
}

export const Component: React.FC<ComponentProps> = ({...}) => {
  return (...)
}
```

## Sorun Giderme

### Type Errors
- Check interfaces in `src/types/index.ts`
- Verify import paths
- Use `as` for type assertions cautiously

### Render Issues
- Check component props
- Verify client components have 'use client'
- Check localStorage timing

### Build Errors
- Clear `.next` folder
- Reinstall dependencies
- Check for duplicate exports

## Deploy Preparation

- ✅ Build succeeds without errors
- ✅ TypeScript passes
- ✅ All routes accessible
- ✅ Data persists correctly
- ✅ Mobile responsive
- ✅ No console errors

## Kaynaklar

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Last Updated**: February 2026
**Project Status**: Production Ready ✅
