/**
 * StorageService - Handles local storage operations
 * Provides a clean abstraction for browser storage
 */

export class StorageService {
  private readonly prefix = 'hizliokuma_';

  /**
   * Set item in localStorage
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error(`Error saving to storage: ${key}`, error);
    }
  }

  /**
   * Get item from localStorage
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return defaultValue || null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return defaultValue || null;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error);
    }
  }

  /**
   * Clear all stored items with prefix
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  }

  /**
   * Check if item exists
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(this.prefix + key) !== null;
  }
}

export const storageService = new StorageService();
export default StorageService;
