import { useState, useEffect } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Cargar tema desde localStorage al inicializar
    const savedTheme = localStorage.getItem('sgi-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Si no hay tema guardado, usar el tema claro por defecto
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('sgi-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setLightTheme = () => {
    setTheme('light');
    localStorage.setItem('sgi-theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  };

  const setDarkTheme = () => {
    setTheme('dark');
    localStorage.setItem('sgi-theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  };

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};

export default useTheme;