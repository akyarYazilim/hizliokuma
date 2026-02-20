/**
 * Time formatting utilities
 */

export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;
}

/**
 * Number formatting utilities
 */

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toFixed(decimals);
}

export function formatPercentage(current: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((current / total) * 100)}%`;
}

/**
 * Text processing utilities
 */

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Classification utilities
 */

export function getScoreBadge(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) return { label: 'Mükemmel', color: 'green' };
  if (score >= 80) return { label: 'Çok İyi', color: 'blue' };
  if (score >= 70) return { label: 'İyi', color: 'yellow' };
  if (score >= 60) return { label: 'Orta', color: 'orange' };
  return { label: 'Düşük', color: 'red' };
}

export function getWPMLevel(wpm: number): string {
  if (wpm < 100) return 'Başlangıç (< 100 WPM)';
  if (wpm < 200) return 'Orta (100-200 WPM)';
  if (wpm < 300) return 'İyi (200-300 WPM)';
  if (wpm < 400) return 'Çok İyi (300-400 WPM)';
  return 'Uzman (> 400 WPM)';
}

/**
 * Random utilities
 */

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B869', '#52B788'
  ];
  return getRandomItem(colors);
}
