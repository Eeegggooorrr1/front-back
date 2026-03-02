const { nanoid } = require('nanoid');

class ProductService {
  constructor() {
    this.products = [];
  }

  getAll() {
    return this.products;
  }

  getById(id) {
    const p = this.products.find((x) => x.id === id);
    if (!p) throw new Error('Product not found');
    return p;
  }

  create(payload) {
    const name = (payload.name || '').trim();
    const category = (payload.category || '').trim();
    const description = (payload.description || '').trim();
    const price = Number(payload.price);
    const stock = Number(payload.stock);

    if (!name) throw new Error('Name is required');
    if (!category) throw new Error('Category is required');
    if (!description) throw new Error('Description is required');
    if (!Number.isFinite(price) || price < 0) throw new Error('Price must be a non-negative number');
    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) throw new Error('Stock must be a non-negative integer');

    const newProduct = {
      id: nanoid(6),
      name,
      category,
      description,
      price,
      stock
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id, payload) {
    const p = this.products.find((x) => x.id === id);
    if (!p) throw new Error('Product not found');

    const hasFields = ('name' in payload) || ('category' in payload) || ('description' in payload) || ('price' in payload) || ('stock' in payload);
    if (!hasFields) throw new Error('Nothing to update');

    if ('name' in payload) {
      const name = (payload.name || '').trim();
      if (!name) throw new Error('Name is required');
      p.name = name;
    }
    if ('category' in payload) {
      const category = (payload.category || '').trim();
      if (!category) throw new Error('Category is required');
      p.category = category;
    }
    if ('description' in payload) {
      const description = (payload.description || '').trim();
      if (!description) throw new Error('Description is required');
      p.description = description;
    }
    if ('price' in payload) {
      const price = Number(payload.price);
      if (!Number.isFinite(price) || price < 0) throw new Error('Price must be a non-negative number');
      p.price = price;
    }
    if ('stock' in payload) {
      const stock = Number(payload.stock);
      if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) throw new Error('Stock must be a non-negative integer');
      p.stock = stock;
    }

    return p;
  }

  delete(id) {
    const exists = this.products.some((x) => x.id === id);
    if (!exists) throw new Error('Product not found');
    this.products = this.products.filter((x) => x.id !== id);
  }
}

module.exports = ProductService;