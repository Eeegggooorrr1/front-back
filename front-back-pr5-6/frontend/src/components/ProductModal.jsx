import React, { useEffect, useState } from 'react';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialProduct?.name ?? '');
    setCategory(initialProduct?.category ?? '');
    setDescription(initialProduct?.description ?? '');
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : '');
    setStock(initialProduct?.stock != null ? String(initialProduct.stock) : '');
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === 'edit' ? 'Редактирование товара' : 'Создание товара';

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    const cat = category.trim();
    const desc = description.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (!trimmed) return alert('Введите название');
    if (!cat) return alert('Введите категорию');
    if (!desc) return alert('Введите описание');
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) return alert('Введите корректную цену');
    if (!Number.isFinite(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) return alert('Введите корректный остаток на складе');
    onSubmit({
      id: initialProduct?.id,
      name: trimmed,
      category: cat,
      description: desc,
      price: parsedPrice,
      stock: parsedStock
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose}>✕</button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </label>
          <label className="label">
            Категория
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </label>
          <label className="label">
            Описание
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="label">
            Цена
            <input className="input" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" />
          </label>
          <label className="label">
            Остаток
            <input className="input" value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" />
          </label>
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn btn--primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
}