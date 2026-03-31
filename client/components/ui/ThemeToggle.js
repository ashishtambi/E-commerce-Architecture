'use client';

import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-accent-400/40 bg-white/70 p-2 text-accent-600 transition hover:scale-105 dark:border-accent-200/30 dark:bg-slate-900/70 dark:text-accent-200"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  );
}
