import React, { useEffect, useState } from 'react';

export default function UserModal({ open, initialUser, onClose, onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUsername(initialUser?.username ?? '');
    setPassword('');
    setRole(initialUser?.role ?? 'user');
    setBlocked(Boolean(initialUser?.blocked));
  }, [open, initialUser]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = username.trim();
    if (!trimmed) {
      alert('Введите логин');
      return;
    }

    onSubmit({
      id: initialUser?.id,
      username: trimmed,
      password: password.trim() || undefined,
      role,
      blocked,
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">Редактирование пользователя</div>
          <button className="iconBtn" onClick={onClose}>✕</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Логин
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </label>

          <label className="label">
            Новый пароль
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="label">
            Роль
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Пользователь</option>
              <option value="seller">Продавец</option>
              <option value="admin">Администратор</option>
            </select>
          </label>

          <label className="label">
            <input
              type="checkbox"
              checked={blocked}
              onChange={(e) => setBlocked(e.target.checked)}
            />
            Заблокирован
          </label>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}