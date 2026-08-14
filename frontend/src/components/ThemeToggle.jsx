import  useThemeStore  from "../store/themeStore";

const ThemeToggle = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-sm"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
};

export default ThemeToggle;