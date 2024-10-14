// src/services/LocalStorageService.ts
export const getFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const setToLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};
