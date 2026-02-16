const Product = require('./models');

class ProductService {
  constructor() {
    this.storage = new Map();
  }

  getAll() {
    return Array.from(this.storage.values());
  }

  getById(id) {
    const product = this.storage.get(id);
    if (!product) throw new Error('Товар не найден');
    return product;
  }

  create(data) {
    const id = Date.now().toString();
    const product = new Product(id, data.name, data.price);
    this.storage.set(id, product);
    return product;
  }

  update(id, data) {
    const existing = this.storage.get(id);
    if (!existing) throw new Error('Товар не найден');
    const updated = new Product(id, data.name || existing.name, data.price || existing.price);
    this.storage.set(id, updated);
    return updated;
  }

  delete(id) {
    const exists = this.storage.get(id);
    if (!exists) throw new Error('Товар не найден');
    return this.storage.delete(id);
  }
}

module.exports = ProductService;