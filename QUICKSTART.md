# 🚀 Hızlı Okuma Platformu - Hızlı Başlangıç

## Tebrikler! 🎉

Sektör standarlarına uygun, 5 egzersiz türüne sahip bir hızlı okuma platformu başarıyla kuruldu!

---

## ⚡ 60 Saniyede Başlayın

### 1. Terminal'i açın ve şu komutu çalıştırın:
```bash
npm run dev
```

### 2. Tarayıcınızda açın:
```
http://localhost:3000
```

### 3. Egzersiz seçin ve başlayın! 🎯

---

## 📁 Proje Yapısı (Quick Reference)

```
src/
├── app/               ← Sayfalar (Home, Exercises, Progress)
├── components/        ← UI Bileşenleri
├── services/          ← Business Logic (ExerciseService, StorageService)
├── hooks/             ← Custom Hooks (useExerciseTimer, useExerciseState)
├── types/             ← TypeScript Tanımlamaları
├── constants/         ← Egzersiz Verisi
└── utils/             ← Yardımcı Fonksiyonlar
```

---

## 🎯 5 Egzersiz Türü

### ⚡ Hız Okuma Testi
- Metin okuyun → Anlama sorularını cevaplayın
- **WPM** (Dakika başına kelime) ölçülür
- `/exercises/speed-test-1`

### 👁️ Kelime Tanıma
- 10 turda kelime bulun
- Doğru: +10 puan, Yanlış: -5 puan
- `/exercises/word-recognition-1`

### 🎯 Fokus Antrenmanı
- Dikkat yeteneğini geliştir
- `/exercises/focus-training-1`

### 📚 Anlama Becerisi
- İleri seviye anlama testi
- `/exercises/comprehension-1`

### 👀 Çevre Görüş
- Grid'de hedefleri bul
- Periferik vizyonu geliştir
- `/exercises/peripheral-vision-1`

---

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev              # http://localhost:3000

# Üretim derlemesi
npm run build
npm run start

# Linting
npm run lint
```

---

## 📊 Sayfalar

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Home | `/` | Giriş sayfası ve öne çıkan egzersizler |
| Exercises | `/exercises` | Tüm egzersizleri göster, filtrele |
| Exercise Detail | `/exercises/[id]` | Egzersizi çalıştır |
| Progress | `/progress` | Tüm sonuçları ve istatistikleri görüntüle |

---

## 💡 Temel Özellikler

✅ **5 Egzersiz Türü** - Her biri farklı beceri geliştirir
✅ **Filtreleme** - Kategoriye veya zorluğa göre egzersiz seç
✅ **Skor Sistemi** - Her egzersizin kendi puan sistemi
✅ **İlerleme Takibi** - localStorage ile sonuçlar kaydedilir
✅ **Responsive Design** - Mobile, tablet, desktop uyumlu
✅ **TypeScript** - Tam tip güvenliği
✅ **Clean Code** - Tasarım desenleri kullanıldı

---

## 📝 Yeni Egzersiz Ekleme

### 1. Type tanımını ekle (`src/types/index.ts`)
```typescript
export interface NewExercise extends Exercise {
  customField: string;
}
```

### 2. Verileri ekle (`src/constants/exercises.ts`)
```typescript
export const NEW_EXERCISE: NewExercise = { ... }
export const ALL_EXERCISES = [..., NEW_EXERCISE]
```

### 3. Component oluştur (`src/components/exercises/NewExercise.tsx`)
```typescript
export const NewExerciseComponent: React.FC<Props> = ({ exercise, onComplete }) => {
  // Component code
}
```

### 4. Page'de render et (`src/app/exercises/[id]/page.tsx`)
```typescript
if (exercise.category === 'new-type') {
  return <NewExerciseComponent exercise={exercise} onComplete={...} />
}
```

---

## 🎨 Styling

**Tailwind CSS** kullanılır. Özel stiller `src/app/globals.css`'de tanımlanabilir.

```tsx
<Button variant="primary" size="lg">
  Başla
</Button>

<Card>
  <CardHeader title="Başlık" />
  <CardBody>İçerik</CardBody>
  <CardFooter>Alt</CardFooter>
</Card>
```

---

## 💾 Veri Saklama

Daha fazla bilgi için bkz: [ARCHITECTURE.md](./ARCHITECTURE.md)

```typescript
// StorageService kullanımı
import { storageService } from '@/services/StorageService'

// Veri kaydet
storageService.setItem('results', resultsArray)

// Veri oku
const results = storageService.getItem('results', [])
```

---

## 🐛 Sorun Giderme

### Port 3000 zaten kullanımda?
```bash
PORT=3001 npm run dev
```

### Build hatası?
```bash
# Cache temizle ve yeniden derle
rm -rf .next
npm run build
```

### localStorage sorunları?
```bash
# Browser memory temizle (DevTools)
localStorage.clear()
```

---

## 📚 Detaylı Dokumentasyon

- **[README.md](./README.md)** - Proje özeti
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Sistem mimarisi
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Kurulum bilgileri

---

## 🎓 Sektör Standartları

✅ Clean Architecture
✅ 7+ Design Patterns
✅ TypeScript Type Safety
✅ React Best Practices
✅ SOLID Principles
✅ Responsive Design
✅ Comprehensive Documentation

---

## 🚀 Sonraki Adımlar

1. Tarayıcıda `http://localhost:3000`'e gidin
2. Egzersizleri keşfedin
3. Birkaç tane çalıştırın
4. İlerleme sayfasına bakın
5. Kodları inceleyip öğrenin!

---

## 📞 İletişim & Destek

Kod yapısı, tasarım desenleri veya özellikler hakkında sorular?
Kod içerisinde ayrıntılı yorumlar bulunmaktadır.

---

**Happy Coding! 🎉**

Bu proje tam olarak üretim ortamına hazır, ölçeklenebilir ve bakımı kolaydır.
Dilediğiniz özellikleri ekleyerek genişletebilirsiniz.

📅 Son Güncelleme: Şubat 2026
