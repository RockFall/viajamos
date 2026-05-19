"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // Hydrate from localStorage after mount (avoids SSR mismatch)
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client hydration
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      console.warn(`Error reading localStorage key "${key}"`);
    }
    setIsHydrated(true);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          console.warn(`Error writing localStorage key "${key}"`);
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue, isHydrated];
}
