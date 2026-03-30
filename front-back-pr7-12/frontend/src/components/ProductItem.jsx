import React from 'react';

export default function ProductItem({ product, onEdit, onDelete, canEdit, canDelete }) {
  return (
    <div className="productRow">
      <div className="productMain">
        <div className="productName">{product.name}</div>
        <div className="productCategory">{product.category}</div>
        <div className="productDesc">{product.description}</div>
      </div>

      <div className="productMeta">
        <div className="productPrice">{product.price} ₽</div>
        <div className="productStock">В наличии: {product.stock}</div>
      </div>

      {(canEdit || canDelete) && (
        <div className="productActions">
          {canEdit && (
            <button className="btn" onClick={() => onEdit(product)}>
              Редактировать
            </button>
          )}
          {canDelete && (
            <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
              Удалить
            </button>
          )}
        </div>
      )}
    </div>
  );
}