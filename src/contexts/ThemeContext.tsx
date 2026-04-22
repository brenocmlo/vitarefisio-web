import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const resolvedTheme = useMemo(
    () => (theme === 'system' ? systemTheme : theme),
    [theme, systemTheme]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = (event?: MediaQueryListEvent) => {
      setSystemTheme(event?.matches ?? mediaQuery.matches ? 'dark' : 'light');
    };

    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [resolvedTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
