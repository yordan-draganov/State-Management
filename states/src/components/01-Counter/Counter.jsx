import React, { useReducer, useEffect } from 'react';

const initialState = { count: 0, history: [] };

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': {
      const n = state.count + 1;
      return {
        count: n,
        history: [`+1 -> ${n}`, ...state.history].slice(0, 10),
      };
    }
    case 'DECREMENT': {
      const n = state.count - 1;
      return {
        count: n,
        history: [`-1 -> ${n}`, ...state.history].slice(0, 10),
      };
    }
    case 'RESET':
      return {
        count: 0,
        history: [`Reset -> 0`, ...state.history].slice(0, 10),
      };
    case 'INCREMENT_BY': {
      const n = state.count + action.payload;
      return {
        count: n,
        history: [`+${action.payload} -> ${n}`, ...state.history].slice(0, 10),
      };
    }
    default:
      return state;
  }
}

const btn = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('counter_app');
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState, loadFromStorage);

  useEffect(() => {
    localStorage.setItem('counter_app', JSON.stringify(state));
  }, [state]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        maxWidth: '300px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 6px', color: '#333' }}>Counter</h3>

      <div style={{ fontSize: '56px', fontWeight: '700', color: '#007bff', margin: '10px 0 20px' }}>
        {state.count}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          width: '100%',
          marginBottom: '16px',
        }}
      >
        <button
          style={{ ...btn, background: '#007bff', color: '#fff' }}
          onClick={() => dispatch({ type: 'INCREMENT' })}
        >
          +1
        </button>
        <button
          style={{ ...btn, background: '#6c757d', color: '#fff' }}
          onClick={() => dispatch({ type: 'DECREMENT' })}
        >
          -1
        </button>
        <button
          style={{ ...btn, background: '#28a745', color: '#fff' }}
          onClick={() => dispatch({ type: 'INCREMENT_BY', payload: 10 })}
        >
          +10
        </button>
        <button
          style={{ ...btn, background: '#dc3545', color: '#fff' }}
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Reset
        </button>
      </div>

      <div style={{ width: '100%', borderTop: '1px solid #eee', paddingTop: '12px' }}>
        <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>
          History
        </p>
        {state.history.map((entry, i) => (
          <div key={i} style={{ fontSize: '13px', color: '#666', padding: '2px 0' }}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}