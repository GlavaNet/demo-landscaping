import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = (savedTheme as 'light' | 'dark') || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={`p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
        ${className}`.trim()}
    >
      {theme === 'light'
        ? <Moon size={20} aria-hidden="true" />
        : <Sun  size={20} aria-hidden="true" />}
      <span className="sr-only">
        {`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      </span>
    </button>
  );
};

export default ThemeToggle;
