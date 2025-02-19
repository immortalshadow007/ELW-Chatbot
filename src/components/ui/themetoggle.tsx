"use client";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Simple toggle: if theme is "dark", switch to "light"; otherwise switch to "dark".
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggleTheme} className="themeToggleButton">
      {theme === "dark" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
