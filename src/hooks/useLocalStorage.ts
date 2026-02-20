/**
 * useLocalStorage - Custom hook for managing localStorage
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(`hizliokuma_${key}`);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setIsLoaded(true);
    }
  }, [key]);

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(
          `hizliokuma_${key}`,
          JSON.stringify(valueToStore)
        );
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isLoaded] as const;
}

export default useLocalStorage;
