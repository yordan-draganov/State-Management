import React, { useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      filter: 'all',
      searchQuery: '',
      addTodo: (text) =>
        set((s) => ({
          todos: [...s.todos, { id: Date.now(), text, done: false }],
        })),
      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      deleteTodo: (id) =>
        set((s) => ({
          todos: s.todos.filter(t => t.id !== id),
        })),
      setFilter: (filter) => set({ filter }),
      setSearch: (searchQuery) => set({ searchQuery }),
    }),
    { name: 'todo-storage' }
  )
);

const btn = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
};

export default function TodoApp() {
  const { todos, filter, searchQuery, toggleTodo, deleteTodo, setFilter, setSearch } = useTodoStore();
  const [text, setText] = useState('');

  const filtered = todos.filter(t => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'active' ? !t.done : t.done;
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const doneCount = todos.filter(t => t.done).length;
  const percent = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim()) {
      useTodoStore.getState().addTodo(text.trim());
      setText('');
    }
  }

  return (
    <div
      style={{
        maxWidth: '420px',
        margin: '0 auto',
        padding: '24px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ textAlign: 'center', margin: '0 0 16px', color: '#333' }}>Todo List</h3>

      <input
        placeholder="Търси задачи..."
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: '6px',
          border: '1px solid #ddd',
          boxSizing: 'border-box',
          marginBottom: '10px',
          fontSize: '14px',
        }}
      />

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...btn,
              flex: 1,
              background: filter === f ? '#007bff' : '#e9ecef',
              color: filter === f ? '#fff' : '#555',
            }}
          >
            {f === 'all' ? 'Всички' : f === 'active' ? 'Активни' : 'Завършени'}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '80px', marginBottom: '12px' }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: '13px' }}>Няма задачи</p>
        )}
        {filtered.map(t => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTodo(t.id)}
              style={{ cursor: 'pointer' }}
            />
            <span
              style={{
                flex: 1,
                fontSize: '14px',
                color: '#333',
                textDecoration: t.done ? 'line-through' : 'none',
                opacity: t.done ? 0.5 : 1,
              }}
            >
              {t.text}
            </span>
            <button
              onClick={() => deleteTodo(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0 4px',
              }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Нова задача..."
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />
        <button type="submit" style={{ ...btn, background: '#28a745', color: '#fff', padding: '9px 18px' }}>
          Добави
        </button>
      </form>

      <div style={{ marginTop: '14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#999',
            marginBottom: '6px',
          }}
        >
          <span>{doneCount}/{todos.length} завършени</span>
          <span>{percent}%</span>
        </div>
        <div style={{ width: '100%', height: '5px', background: '#eee', borderRadius: '99px' }}>
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              background: '#28a745',
              borderRadius: '99px',
              transition: '0.3s',
            }}
          />
        </div>
      </div>
    </div>
  );
}