import { createContext, useState, useEffect } from 'react';
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [prefersDarkMode, setPrefersDarkMode] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    useEffect(() => {
        const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = () => setPrefersDarkMode(mediaQueryList.matches);
        mediaQueryList.addEventListener('change', listener);
        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, []);

    useEffect(() => {
      setTheme(prefersDarkMode ? 'dark' : 'light');
    }, [prefersDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
