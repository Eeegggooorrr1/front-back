import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import UserModal from '../../components/UserModal';
import UsersList from '../../components/UsersList';
import './UsersPage.scss';

export default function UsersPage({ user, onLogout, onGoProducts, onGoUsers }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingUser(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (payload) => {
    try {
      const updated = await api.updateUser(payload.id, payload);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      closeModal();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Ошибка сохранения');
    }
  };

  const handleBlock = async (id) => {
    const ok = window.confirm('Заблокировать пользователя?');
    if (!ok) return;

    try {
      await api.blockUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, blocked: true } : u)));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Ошибка блокировки');
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Products App</div>
          <div className="header__right">
            <div className="nav">
              <button className="btn" onClick={onGoProducts}>Товары</button>
              <button className="btn btn--primary">Пользователи</button>
            </div>
            <span className="roleTag">{user.username} · {user.role}</span>
            <button className="btn" onClick={onLogout}>Выйти</button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Пользователи</h1>
            <button className="btn btn--primary" onClick={openCreate}>
              + Создать
            </button>
          </div>

          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : (
            <UsersList
              users={users}
              onEdit={openEdit}
              onBlock={handleBlock}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">© {new Date().getFullYear()} Products App</div>
      </footer>

      <UserModal
        open={modalOpen}
        initialUser={editingUser}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}