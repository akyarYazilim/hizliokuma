'use client';

import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { ALL_EXERCISES } from '@/constants/exercises';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold text-gray-400">
          Hızlı Okuma Becerilerinizi Geliştirin
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          İnteraktif egzersizler ile okuma hızınızı, dikkat gücünüzü ve anlama yeteneğinizi geliştirin.
          Bilim-tabanlı antrenmanlar ile ölçülebilir sonuçlar elde edin.
        </p>
        <Link href="/exercises">
          <Button variant="primary" size="lg">
            Egzersizlere Başla →
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">Hız Testi</h3>
          <p className="text-gray-600 text-sm">
            Dakika başına kaç kelime okuyduğunuzu ölçün ve ilerlemenizi izleyin.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2">Anlama Egzersizleri</h3>
          <p className="text-gray-600 text-sm">
            Hızlı okuduğunuz metinleri anlama yeteneğinizi test edin.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">👀</div>
          <h3 className="text-xl font-bold mb-2">Çevre Görüş</h3>
          <p className="text-gray-600 text-sm">
            Periferik vizyonunuzu geliştirerek algınızı genişletin.
          </p>
        </div>
      </section>

      {/* Featured Exercises */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-400">Öne Çıkan Egzersizler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_EXERCISES.map((exercise) => (
            <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
              <div className="bg-white rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{exercise.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{exercise.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>
                <div className="text-xs text-gray-500">
                  ⏱️ {exercise.duration} saniye
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 rounded-lg p-12 text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-400">Nasıl Çalışıyor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
            <p className="font-semibold text-gray-400">Seç</p>
            <p className="text-sm text-gray-600">Bir egzersiz seçin</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
            <p className="font-semibold text-gray-400">Çalış</p>
            <p className="text-sm text-gray-600">Antrenman yapın</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <p className="font-semibold text-gray-400">Öğren</p>
            <p className="text-sm text-gray-600">Sonuçlarınızı görün</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
            <p className="font-semibold text-gray-400">İlerleme</p>
            <p className="text-sm text-gray-600">Düzenli antrenmanla gelişin</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold text-gray-400">Bugün Başlamaya Hazır Mısın?</h2>
        <p className="text-lg text-gray-600">
          Ücretsiz olarak tüm egzersizleri deneyebilirsin. Düzenli antrenmanla hızlı sonuçlar elde et.
        </p>
        <Link href="/exercises">
          <Button variant="primary" size="lg">
            Şimdi Başla
          </Button>
        </Link>
      </section>
    </div>
  );
}
