import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
  // État initial basé sur le localStorage ou la valeur initiale fournie
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erreur lors de la lecture de ${key}:`, error);
      return initialValue;
    }
  });

  // Sauvegarde dans le localStorage à chaque modification de la valeur
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
