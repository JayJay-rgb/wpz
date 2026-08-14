import { create } from "zustand";

const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const useThemeStore = create((set, get) => ({
  isDark: getInitialTheme(),
  toggleTheme: () => {
    const newValue = !get().isDark;
    set({ isDark: newValue });
    document.documentElement.classList.toggle("dark", newValue);
    localStorage.setItem("theme", newValue ? "dark" : "light");
  },
  initTheme: () => {
    document.documentElement.classList.toggle("dark", get().isDark);
  },
}));

export default useThemeStore;