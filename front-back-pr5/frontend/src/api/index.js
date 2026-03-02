import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json'
  }
});

export const api = {
  getProducts: async () => {
    const r = await apiClient.get('/products');
    return r.data;
  },
  getProductById: async (id) => {
    const r = await apiClient.get(`/products/${id}`);
    return r.data;
  },
  createProduct: async (product) => {
    const r = await apiClient.post('/products', product);
    return r.data;
  },
  updateProduct: async (id, product) => {
    const r = await apiClient.put(`/products/${id}`, product);
    return r.data;
  },
  deleteProduct: async (id) => {
    const r = await apiClient.delete(`/products/${id}`);
    return r.data;
  }
};