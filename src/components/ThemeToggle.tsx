import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 border border-line hover:border-ink-100 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-ink-100" strokeWidth={1.5} />
      ) : (
        <Moon className="w-4 h-4 text-ink-100" strokeWidth={1.5} />
      )}
    </button>
  );
}
