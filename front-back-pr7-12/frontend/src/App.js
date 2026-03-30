import React, { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage/AuthPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import UsersPage from './pages/UsersPage/UsersPage';
import { api, clearSession, getStoredUser, saveSession } from './api';

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('products');

  useEffect(() => {
    if (user?.role !== 'admin') {
      setView('products');
    }
  }, [user]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const me = await api.me();
      saveSession({ user: me });
      setUser(me);
    } catch (error) {
      try {
        const data = await api.refresh();
        setUser(data.user);
      } catch (refreshError) {
        clearSession();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (data) => {
    setUser(data.user);
    setView('products');
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="empty">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  if (user.role === 'admin' && view === 'users') {
    return (
      <UsersPage
        user={user}
        onLogout={handleLogout}
        onGoProducts={() => setView('products')}
        onGoUsers={() => setView('users')}
      />
    );
  }

  return (
    <ProductsPage
      user={user}
      onLogout={handleLogout}
      onGoUsers={user.role === 'admin' ? () => setView('users') : null}
      onGoProducts={() => setView('products')}
    />
  );
}

export default App;