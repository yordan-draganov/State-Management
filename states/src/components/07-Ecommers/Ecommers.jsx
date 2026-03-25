import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shop_user'));
    } catch {
      return null;
    }
  });

  function login(email) {
    const u = { email, name: email.split('@')[0] };
    setUser(u);
    localStorage.setItem('shop_user', JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('shop_user');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useProductStore = create(
  persist(
    (set) => ({
      products: [
        { id: 1, name: 'React Pro Course', price: 120, cat: 'Курсове' },
        { id: 2, name: 'JS Ultimate Mug',  price: 25,  cat: 'Мърч' },
        { id: 3, name: 'Clean Code Book',  price: 45,  cat: 'Книги' },
      ],
      favorites: [],
      toggleFav: (id) =>
        set(s => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter(f => f !== id)
            : [...s.favorites, id],
        })),
    }),
    { name: 'shop-products-v2' }
  )
);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.p.id);
      if (existing) {
        return state.map(i =>
          i.id === action.p.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.p, qty: 1 }];
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

const btn = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
};

function ProductCard({ p, onAdd, isFav, toggleFav }) {
  return (
    <div
      style={{
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '16px',
        position: 'relative',
      }}
    >
      <button
        onClick={() => toggleFav(p.id)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        {isFav ? '♥' : '♡'}
      </button>
      <div
        style={{
          fontSize: '11px',
          color: '#007bff',
          fontWeight: '600',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}
      >
        {p.cat}
      </div>
      <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#333' }}>{p.name}</h4>
      <div style={{ fontSize: '16px', fontWeight: '700', color: '#28a745', marginBottom: '12px' }}>
        ${p.price}
      </div>
      <button
        onClick={() => onAdd(p)}
        style={{ ...btn, background: '#007bff', color: '#fff', width: '100%' }}
      >
        Добави в количка
      </button>
    </div>
  );
}

function ShopUI() {
  const { user, login, logout } = useContext(AuthContext);
  const { products, favorites, toggleFav } = useProductStore();

  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem('shop_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shop_cart_v2', JSON.stringify(cart));
  }, [cart]);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div
      style={{
        maxWidth: '700px',
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
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e9ecef',
        }}
      >
        <h3 style={{ margin: 0, color: '#333' }}>TechShop</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
          {user ? (
            <>
              <span style={{ color: '#555' }}>
                Здравей, <b>{user.name}</b>
              </span>
              <button
                onClick={logout}
                style={{ ...btn, background: 'none', color: '#007bff', border: '1px solid #007bff' }}
              >
                Изход
              </button>
            </>
          ) : (
            <button
              onClick={() => login('demo@react.com')}
              style={{ ...btn, background: '#333', color: '#fff' }}
            >
              Вход
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div
          style={{
            flex: 3,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
          }}
        >
          {products.map(p => (
            <ProductCard
              key={p.id}
              p={p}
              onAdd={(p) => dispatch({ type: 'ADD', p })}
              isFav={favorites.includes(p.id)}
              toggleFav={toggleFav}
            />
          ))}
        </div>

        <div
          style={{
            flex: 1,
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '16px',
            height: 'fit-content',
            minWidth: '160px',
          }}
        >
          <h4 style={{ margin: '0 0 12px', color: '#333' }}>Количка</h4>
          {cart.length === 0 && (
            <p style={{ color: '#bbb', fontSize: '13px' }}>Празна</p>
          )}
          {cart.map(i => (
            <div key={i.id} style={{ fontSize: '13px', color: '#555', marginBottom: '6px' }}>
              {i.name} x{i.qty}
            </div>
          ))}
          <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #eee' }} />
          <strong style={{ fontSize: '15px' }}>Общо: ${total.toFixed(2)}</strong>
          <button
            onClick={() => dispatch({ type: 'CLEAR' })}
            style={{
              ...btn,
              width: '100%',
              marginTop: '10px',
              background: 'none',
              border: '1px solid #dc3545',
              color: '#dc3545',
            }}
          >
            Изчисти
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EcommerceApp() {
  return (
    <AuthProvider>
      <ShopUI />
    </AuthProvider>
  );
}