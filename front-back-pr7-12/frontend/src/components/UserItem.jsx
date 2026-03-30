import React from 'react';

export default function UserItem({ user, onEdit, onBlock }) {
  return (
    <div className="userRow">
      <div className="userMain">
        <div className="userName">{user.username}</div>
        <div className="userMeta">Роль: {user.role}</div>
        <div className="userMeta">Статус: {user.blocked ? 'Заблокирован' : 'Активен'}</div>
      </div>

      <div className="userActions">
        <button className="btn" onClick={() => onEdit(user)}>
          Редактировать
        </button>
        {!user.blocked && (
          <button className="btn btn--danger" onClick={() => onBlock(user.id)}>
            Заблокировать
          </button>
        )}
      </div>
    </div>
  );
}