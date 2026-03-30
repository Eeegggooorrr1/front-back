import React from 'react';
import UserItem from './UserItem';

export default function UsersList({ users, onEdit, onBlock }) {
  if (!users.length) {
    return <div className="empty">Пользователей пока нет</div>;
  }

  return (
    <div className="list">
      {users.map((item) => (
        <UserItem
          key={item.id}
          user={item}
          onEdit={onEdit}
          onBlock={onBlock}
        />
      ))}
    </div>
  );
}