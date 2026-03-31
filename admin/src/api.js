import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

export const adminApi = {
  login: (payload) => client.post('/auth/login', payload),
  me: () => client.get('/auth/me'),

  stats: () => client.get('/admin/stats'),

  products: (params = {}) => client.get('/products', { params }),
  createProduct: (payload) => client.post('/products', payload),
  updateProduct: (id, payload) => client.put(`/products/${id}`, payload),
  deleteProduct: (id) => client.delete(`/products/${id}`),

  categories: () => client.get('/categories'),
  createCategory: (payload) => client.post('/categories', payload),

  orders: () => client.get('/orders/admin/all'),
  updateOrderStatus: (id, status) => client.patch(`/orders/admin/${id}/status`, { status }),

  users: () => client.get('/users/admin/all'),

  uploadImages: (formData, onProgress) =>
    client.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        onProgress(Math.round((event.loaded * 100) / event.total));
      },
    }),
  uploadImage: (formData, onProgress) =>
    client.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        onProgress(Math.round((event.loaded * 100) / event.total));
      },
    }),
  deleteUploadedImage: (path) => client.delete('/uploads', { data: { path } }),
};

export { API_URL };
