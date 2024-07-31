import { JSX, createContext, useContext, createSignal } from 'solid-js';

interface ThemeContextType {
  theme: () => string;
  changeTheme: (newTheme: string) => void;
}

interface ThemeProviderProps {
  children: JSX.Element;
}

const ThemeContext = createContext<ThemeContextType>();

export function ThemeProvider(props: ThemeProviderProps) {
  const [theme, setTheme] = createSignal('light-theme');

  const store: ThemeContextType = {
    theme,
    changeTheme: (newTheme: string) => {
      setTheme(newTheme);
      const root = document.documentElement;
      root.className = newTheme;
    }
  };

  return (
    <ThemeContext.Provider value={store}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
