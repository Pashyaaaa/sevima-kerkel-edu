import { useState, useEffect, useCallback } from "react";

export function useLocalStorage(key, initialValue) {
  // Baca sekali saat mount
  const readValue = useCallback(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (err) {
      console.warn(`useLocalStorage: gagal parse "${key}"`, err);
      return initialValue;
    }
  }, [key, initialValue]);

  const [stored, setStored] = useState(readValue);

  // Tulis setiap kali berubah
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(stored));
    } catch (err) {
      console.warn(`useLocalStorage: gagal simpan "${key}"`, err);
    }
  }, [key, stored]);

  // Sync antar tab (kalau user buka 2 tab)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStored(JSON.parse(e.newValue));
        } catch {
          alert(`useLocalStorage: gagal parse "${key}" dari tab lain`);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const reset = useCallback(() => setStored(initialValue), [initialValue]);

  return [stored, setStored, reset];
}
