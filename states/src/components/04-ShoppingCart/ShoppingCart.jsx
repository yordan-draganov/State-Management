import React, { useReducer, useEffect } from 'react';

const PRODUCTS = [
  { id: 1, name: 'React тениска',   price: 29.99 },
  { id: 2, name: 'JavaScript чаша', price: 14.99 },
  { id: 3, name: 'CSS стикери',     price: 4.99  },
  { id: 4, name: 'Node.js шапка',   price: 24.99 },
];

const LS_KEY = 'shopping_cart_v2';

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.product.id !== action.id) };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items
          .map(i =>
            i.product.id === action.id
              ? { ...i, quantity: Math.max(0, action.quantity) }
              : i
          )
          .filter(i => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

const btn = {
  padding: '8px 14px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
};

const qtyBtn = {
  ...btn,
  padding: '4px 10px',
  background: '#e9ecef',
  color: '#333',
};

export default function ShoppingApp() {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }, [cart]);

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '24px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ textAlign: 'center', margin: '0 0 20px', color: '#333' }}>Shop</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {PRODUCTS.map(p => (
          <div
            key={p.id}
            style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#333' }}>
              {p.name}
            </div>
            <div style={{ fontSize: '15px', color: '#007bff', fontWeight: '700', marginBottom: '10px' }}>
              ${p.price}
            </div>
            <button
              onClick={() => dispatch({ type: 'ADD_ITEM', product: p })}
              style={{ ...btn, background: '#007bff', color: '#fff', width: '100%' }}
            >
              Добави
            </button>
          </div>
        ))}
      </div>

      <h4 style={{ margin: '0 0 12px', color: '#333' }}>Количка ({totalItems})</h4>

      {cart.items.length === 0 && (
        <p style={{ color: '#bbb', fontSize: '13px' }}>Количката е празна.</p>
      )}

      {cart.items.map(item => (
        <div
          key={item.product.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <span style={{ fontSize: '14px', color: '#333' }}>
            {item.product.name} — ${item.product.price}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              style={qtyBtn}
              onClick={() =>
                dispatch({ type: 'UPDATE_QUANTITY', id: item.product.id, quantity: item.quantity - 1 })
              }
            >
              -
            </button>
            <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>
              {item.quantity}
            </span>
            <button
              style={qtyBtn}
              onClick={() =>
                dispatch({ type: 'UPDATE_QUANTITY', id: item.product.id, quantity: item.quantity + 1 })
              }
            >
              +
            </button>
            <button
              onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.product.id })}
              style={{ ...btn, background: '#dc3545', color: '#fff', padding: '4px 10px' }}
            >
              Премахни
            </button>
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <strong style={{ fontSize: '16px' }}>Общо: ${totalPrice.toFixed(2)}</strong>
        <button
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
          disabled={totalItems === 0}
          style={{
            ...btn,
            background: '#6c757d',
            color: '#fff',
            opacity: totalItems === 0 ? 0.5 : 1,
          }}
        >
          Изчисти
        </button>
      </div>
    </div>
  );
}