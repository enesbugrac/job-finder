"use client";

import { useTheme } from "@/providers/theme-provider";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-background-secondary"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <MoonIcon className="w-5 h-5 text-secondary" />
      ) : (
        <SunIcon className="w-5 h-5 text-secondary" />
      )}
    </button>
  );
}
