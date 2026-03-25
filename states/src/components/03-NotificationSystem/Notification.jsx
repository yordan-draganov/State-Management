import React, { createContext, useContext, useReducer, useEffect } from 'react';

const LS_KEY = 'notification_log';

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}

function notificationReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [{ id: action.id, type: action.notifType, message: action.message }, ...state];
    case 'REMOVE':
      return state.filter(n => n.id !== action.id);
    case 'CLEAR_ALL':
      return [];
    default:
      return state;
  }
}

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(notificationReducer, [], loadFromStorage);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(notifications.slice(0, 50)));
  }, [notifications]);

  function removeNotification(id) {
    dispatch({ type: 'REMOVE', id });
  }

  function addNotification(type, message) {
    const id = Date.now();
    dispatch({ type: 'ADD', id, notifType: type, message });
    setTimeout(() => removeNotification(id), 5000);
  }

  function clearAll() {
    dispatch({ type: 'CLEAR_ALL' });
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('Missing NotificationProvider');
  return ctx;
}

const colors = {
  success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
  error:   { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
  warning: { bg: '#fff3cd', border: '#ffeeba', text: '#856404' },
};

const btn = {
  padding: '9px 18px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  color: '#fff',
};

function NotificationUI() {
  const { notifications, addNotification, removeNotification, clearAll } = useNotifications();

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '24px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0, color: '#333' }}>
          Известия{' '}
          <span
            style={{
              fontSize: '13px',
              background: '#007bff',
              color: '#fff',
              borderRadius: '50px',
              padding: '2px 8px',
            }}
          >
            {notifications.length}
          </span>
        </h3>
        {notifications.length > 0 && (
          <button onClick={clearAll} style={{ ...btn, background: '#6c757d' }}>
            Изчисти всички
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => addNotification('success', 'Операцията е успешна!')}
          style={{ ...btn, background: '#28a745' }}
        >
          Успех
        </button>
        <button
          onClick={() => addNotification('error', 'Нещо се обърка!')}
          style={{ ...btn, background: '#dc3545' }}
        >
          Грешка
        </button>
        <button
          onClick={() => addNotification('warning', 'Внимавайте!')}
          style={{ ...btn, background: '#ffc107', color: '#333' }}
        >
          Внимание
        </button>
      </div>

      {notifications.length === 0 && (
        <p style={{ textAlign: 'center', color: '#bbb', fontSize: '13px' }}>Няма известия</p>
      )}

      {notifications.map(n => {
        const c = colors[n.type] || colors.success;
        return (
          <div
            key={n.id}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              color: c.text,
              padding: '10px 14px',
              borderRadius: '6px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            {n.message}
            <button
              onClick={() => removeNotification(n.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: c.text,
                opacity: 0.6,
                fontSize: '14px',
                marginLeft: '10px',
              }}
            >
              x
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function NotificationApp() {
  return (
    <NotificationProvider>
      <NotificationUI />
    </NotificationProvider>
  );
}