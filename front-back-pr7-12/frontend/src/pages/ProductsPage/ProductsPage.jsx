import React, { useEffect, useState } from 'react';
import './ProductsPage.scss';
import ProductsList from '../../components/ProductsList';
import ProductModal from '../../components/ProductModal';
import { api } from '../../api';

export default function ProductsPage({ user, onLogout, onGoUsers }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setModalMode('create');
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Удалить товар?');
    if (!ok) return;

    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Ошибка удаления');
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (modalMode === 'create') {
        const created = await api.createProduct(payload);
        setProducts((prev) => [...prev, created]);
      } else {
        const updated = await api.updateProduct(payload.id, payload);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }

      closeModal();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Ошибка сохранения');
    }
  };

  const role = user?.role || 'user';
  const username = user?.username || '';
  const canCreate = role === 'seller' || role === 'admin';
  const canEdit = role === 'seller' || role === 'admin';
  const canDelete = role === 'admin';

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Products App</div>
          <div className="header__right">
            {role === 'admin' && (
              <div className="nav">
                <button className="btn btn--primary">Товары</button>
                <button className="btn" onClick={onGoUsers}>Пользователи</button>
              </div>
            )}
            <span className="roleTag">{username} · {role}</span>
            <button className="btn" onClick={onLogout}>Выйти</button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Товары</h1>
            {canCreate && (
              <button className="btn btn--primary" onClick={openCreate}>
                + Создать
              </button>
            )}
          </div>

          {!canCreate && (
            <div className="empty">
              Вам доступен только просмотр товаров
            </div>
          )}

          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : (
            <ProductsList
              products={products}
              onEdit={openEdit}
              onDelete={handleDelete}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">© {new Date().getFullYear()} Products App</div>
      </footer>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}