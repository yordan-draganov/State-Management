import React from 'react';

import Counter from './components/01-Counter/Counter';
import ThemeApp from './components/02-Theme/Theme';
import NotificationApp from './components/03-NotificationSystem/Notification';
import ShoppingApp from './components/04-ShoppingCart/ShoppingCart';
import DashboardApp from './components/05-Dashboard/Dashboard';
import TodoAppZustand from './components/06-Todo/Todo';
import EcommerceApp from './components/07-Ecommers/Ecommers';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>React State Management: 7 Задачи</h1>
      
      <h2>Задача 1: Брояч (useReducer)</h2>
      <Counter />

      <h2>Задача 2: Theme Toggle (Context)</h2>
      <ThemeApp />

      <h2>Задача 3: Известия (Context + useReducer)</h2>
      <NotificationApp />

      <h2>Задача 4: Количка (useReducer)</h2>
      <ShoppingApp />

      <h2>Задача 5: Dashboard (Multi-Context)</h2>
      <DashboardApp />

      <h2>Задача 6: Todo App (Zustand)</h2>
      <TodoAppZustand />

      <h2>Задача 7: Mini E-commerce (Mixed)</h2>
      <EcommerceApp />
    </div>
  );
}

export default App;