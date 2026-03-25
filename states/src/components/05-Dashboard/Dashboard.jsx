import React, { createContext, useContext, useState, useEffect } from 'react';

function loadFromStorage(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadFromStorage('dash_theme', 'light'));

  useEffect(() => {
    saveToStorage('dash_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadFromStorage('dash_user', null));

  function login(name) {
    const u = { name, role: 'student' };
    setUser(u);
    saveToStorage('dash_user', u);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('dash_user');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

const translations = {
  bg: {
    dashboard: 'Табло',
    quizzes: 'Тестове',
    settings: 'Настройки',
    welcome: 'Добре дошли',
    login: 'Вход',
    logout: 'Изход',
  },
  en: {
    dashboard: 'Dashboard',
    quizzes: 'Quizzes',
    settings: 'Settings',
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
  },
};

const LangContext = createContext();

function LangProvider({ children }) {
  const [lang, setLang] = useState(() => loadFromStorage('dash_lang', 'bg'));

  useEffect(() => {
    saveToStorage('dash_lang', lang);
  }, [lang]);

  function t(key) {
    return translations[lang][key] || key;
  }

  function toggleLang() {
    setLang(l => (l === 'bg' ? 'en' : 'bg'));
  }

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

const useLang = () => useContext(LangContext);

const headerBtn = {
  padding: '7px 14px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  background: '#f8f9fa',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
};

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const { lang, t, toggleLang } = useLang();

  return (
    <header
      style={{
        padding: '12px 20px',
        background: theme === 'dark' ? '#2d2d2d' : '#fff',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <strong style={{ color: theme === 'dark' ? '#fff' : '#333' }}>Dashboard</strong>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={toggleTheme} style={headerBtn}>
          Тема: {theme}
        </button>
        <button onClick={toggleLang} style={headerBtn}>
          Език: {lang.toUpperCase()}
        </button>
        {user ? (
          <>
            <span style={{ fontSize: '13px', color: theme === 'dark' ? '#ccc' : '#555' }}>
              {user.name}
            </span>
            <button
              onClick={logout}
              style={{ ...headerBtn, color: '#dc3545', borderColor: '#dc3545' }}
            >
              {t('logout')}
            </button>
          </>
        ) : (
          <button
            onClick={() => login('Гост')}
            style={{ ...headerBtn, background: '#007bff', color: '#fff', border: 'none' }}
          >
            {t('login')}
          </button>
        )}
      </div>
    </header>
  );
}

function Sidebar() {
  const { t } = useLang();
  const { theme } = useTheme();

  return (
    <div
      style={{
        width: '150px',
        background: theme === 'dark' ? '#333' : '#f8f9fa',
        borderRight: '1px solid #e9ecef',
        padding: '16px',
      }}
    >
      {['dashboard', 'quizzes', 'settings'].map(item => (
        <div
          key={item}
          style={{
            padding: '8px 10px',
            marginBottom: '4px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            color: theme === 'dark' ? '#ccc' : '#555',
            fontWeight: '500',
          }}
          onMouseEnter={e => (e.target.style.background = theme === 'dark' ? '#444' : '#e9ecef')}
          onMouseLeave={e => (e.target.style.background = 'transparent')}
        >
          {t(item)}
        </div>
      ))}
    </div>
  );
}

function MainContent() {
  const { user } = useAuth();
  const { t } = useLang();
  const { theme } = useTheme();

  return (
    <div style={{ flex: 1, padding: '24px', color: theme === 'dark' ? '#ccc' : '#333' }}>
      {user ? (
        <h3 style={{ margin: 0 }}>
          {t('welcome')}, {user.name}!
        </h3>
      ) : (
        <p style={{ color: '#999' }}>Моля влезте в профила си.</p>
      )}
    </div>
  );
}

export default function DashboardApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LangProvider>
          <div
            style={{
              border: '1px solid #e9ecef',
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '680px',
              margin: '0 auto',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            }}
          >
            <Header />
            <div style={{ display: 'flex', minHeight: '200px' }}>
              <Sidebar />
              <MainContent />
            </div>
          </div>
        </LangProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}