import React, { useState } from 'react';
import { api } from '../../api';
import './AuthPage.scss';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;

      if (mode === 'register') {
        data = await api.register({
          username,
          password,
          role,
        });
      } else {
        data = await api.login({
          username,
          password,
        });
      }

      onAuth(data);
    } catch (error) {
      alert(error.response?.data?.error || 'Ошибка авторизации');
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHead">
          <div className="brand">Products App</div>
          <div className="authText">Вход в систему</div>
        </div>

        <div className="authTabs">
          <button
            className={mode === 'login' ? 'authTab authTab--active' : 'authTab'}
            onClick={() => setMode('login')}
            type="button"
          >
            Вход
          </button>
          <button
            className={mode === 'register' ? 'authTab authTab--active' : 'authTab'}
            onClick={() => setMode('register')}
            type="button"
          >
            Регистрация
          </button>
        </div>

        <form className="authForm" onSubmit={handleSubmit}>
          <label className="label">
            Логин
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="label">
            Пароль
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {mode === 'register' && (
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
          )}

          <button className="btn btn--primary" type="submit">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}