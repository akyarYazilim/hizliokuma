# Hızlı Okuma - Speed Reading Platform

Türkçe dilinde hızlı okuma becerilerini geliştirmek için tasarlanmış modern bir web uygulamasıdır. Eğlenceli ve etkili egzersizler aracılığıyla kullanıcılar okuma hızlarını, anlama yeteneklerini ve dikkat konsantrasyonlarını geliştirebilirler.

## 🎯 Proje Özellikleri

### Egzersiz Türleri (5 Ana Kategori)

1. **⚡ Hız Okuma Testi** - Belirli bir metni okuyun, sonrasında anlama sorularını cevaplayın. Dakika başına kelime (WPM) hızınız ve doğruluk yüzdeniz ölçülür.

2. **👁️ Kelime Tanıma** - Hızlı tahrifleri tanır ve doğru kelimeyi 10 turda bulun. Hız ve doğruluğun test edilir.

3. **🎯 Fokus Antrenmanı** - Dikkat yeteneğinizi geliştirin, hızla akan metinle odaklanma pratiği yapın.

4. **📚 Anlama Becerisi** - Hızla okuduğunuz metni anlama yeteneğinizi test edin. Yüksek hız ile yüksek doğrululuk arasında denge bulun.

5. **👀 Çevre Görüş** - Periferik vizyonunuzu geliştirin. Grid'de gizli hedefleri bulup tıklayarak görüş alanınızı genişletmeyi öğrenin.

### Teknoloji Stack

- **Frontend**: React 18, Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Architecture**: Clean Architecture, Design Patterns
- **State Management**: React Hooks
- **Storage**: localStorage

### Design Patterns Kullanılan

1. **Service Layer Pattern** - Business logic (ExerciseService, StorageService)
2. **Component Pattern** - Reusable UI components
3. **Custom Hooks Pattern** - useExerciseTimer, useExerciseState, useLocalStorage
4. **Singleton Pattern** - Service instances
5. **Repository Pattern** - StorageService (data access)
6. **Factory Pattern** - Exercise initialization
7. **Observer Pattern** - State management (React hooks)

## 📁 Proje Yapısı

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   ├── exercises/
│   │   ├── page.tsx              # Exercises listing
│   │   └── [id]/
│   │       └── page.tsx          # Individual exercise
│   └── progress/
│       └── page.tsx              # Progress tracking
│
├── components/
│   ├── common/                   # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Timer.tsx
│   │   └── ProgressBar.tsx
│   ├── exercises/                # Exercise-specific components
│   │   ├── ExerciseCard.tsx
│   │   ├── SpeedReadingExercise.tsx
│   │   ├── WordRecognitionExercise.tsx
│   │   └── PeripheralVisionExercise.tsx
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
│
├── services/                     # Business logic layer
│   ├── ExerciseService.ts        # Exercise logic
│   └── StorageService.ts         # Data persistence
│
├── hooks/                        # Custom React hooks
│   ├── useExerciseTimer.ts
│   ├── useExerciseState.ts
│   └── useLocalStorage.ts
│
├── types/                        # TypeScript definitions
│   └── index.ts
│
├── constants/                    # Application constants
│   └── exercises.ts
│
└── utils/                        # Utility functions
    ├── formatters.ts
    └── validation.ts
```

## 🚀 Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

3. **Tarayıcıda açın:**
```
http://localhost:3000
```

### Üretim Derlemesi

```bash
npm run build
npm run start
```

## 📊 Mimari Tasarım

### Katman Mimarisi

```
┌─────────────────────────────┐
│     UI Components Layer      │ (Button, Card, Timer vb.)
├─────────────────────────────┤
│      Pages / Routes          │ (Home, Exercises, Progress)
├─────────────────────────────┤
│     Custom Hooks Layer       │ (useExerciseTimer, useState)
├─────────────────────────────┤
│   Services / Business Logic  │ (ExerciseService, StorageService)
├─────────────────────────────┤
│    Types & Constants         │ (Interfaces, Data definitions)
├─────────────────────────────┤
│    Storage / Data Layer      │ (localStorage)
└─────────────────────────────┘
```

## 🎨 Component Örnekleri

### Button Component
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Başla
</Button>
```

### Card Component
```tsx
<Card>
  <CardHeader title="Başlık" subtitle="Açıklaması" />
  <CardBody>İçerik</CardBody>
  <CardFooter>
    <Button>Başla</Button>
  </CardFooter>
</Card>
```

## 📝 Geliştirme Notları

### Yeni Egzersiz Ekleme

1. Type tanımını `src/types/index.ts`'de ekleyin
2. Egzersiz verilerini `src/constants/exercises.ts`'de tanımlayın
3. Component oluşturun `src/components/exercises/`'da
4. `src/app/exercises/[id]/page.tsx`'de render edin

### Stil Kustomizasyonu

Proje Tailwind CSS kullanır. Global stiller `src/app/globals.css`'de bulunur.

## 🧪 Best Practices

- ✅ Type Safety (TypeScript)
- ✅ Component Composition
- ✅ Single Responsibility
- ✅ Reusable Components
- ✅ Error Handling
- ✅ Performance Optimization

## 📄 Detaylı Dokumentasyon

Sistem mimarisi ve design patterns hakkında detaylı bilgi için [ARCHITECTURE.md](./ARCHITECTURE.md) dosyasını kontrol edin.

---

**Son Güncelleme**: Şubat 2026

# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
