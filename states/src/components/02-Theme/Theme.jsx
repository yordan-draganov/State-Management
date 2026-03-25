import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme_choice') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    localStorage.setItem('theme_choice', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        style={{
          background: theme === 'dark' ? '#1a1a2e' : '#f4f7f6',
          color: theme === 'dark' ? '#fff' : '#333',
          minHeight: '300px',
          transition: '0.3s',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        background: theme === 'dark' ? '#16213e' : '#007bff',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>My App</h3>
      <button
        onClick={toggleTheme}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          fontWeight: '600',
          fontSize: '13px',
        }}
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </header>
  );
}

function QuizCard({ title, questions }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme === 'dark' ? '#0f3460' : '#fff',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <h4 style={{ margin: '0 0 4px' }}>{title}</h4>
        <p style={{ margin: 0, opacity: 0.6, fontSize: '13px' }}>{questions} въпроса</p>
      </div>
      <button
        style={{
          padding: '8px 16px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '13px',
        }}
      >
        Започни
      </button>
    </div>
  );
}

export default function ThemeApp() {
  return (
    <ThemeProvider>
      <Header />
      <div style={{ padding: '20px' }}>
        <QuizCard title="HTML Базови" questions={32} />
        <QuizCard title="CSS Напреднали" questions={28} />
      </div>
    </ThemeProvider>
  );
}