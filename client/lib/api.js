const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const request = async (path, { method = 'GET', token, body } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

const serializeFilters = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  return params.toString();
};

export const api = {
  getCategories: () => request('/categories'),
  getProducts: (filters = {}) => request(`/products?${serializeFilters(filters)}`),
  getProduct: (idOrSlug) => request(`/products/${idOrSlug}`),

  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),

  getWishlist: (token) => request('/users/wishlist', { token }),
  toggleWishlist: (token, productId) => request(`/users/wishlist/${productId}`, { method: 'PATCH', token }),

  getCart: (token) => request('/users/cart', { token }),
  addCart: (token, payload) => request('/users/cart', { method: 'POST', token, body: payload }),
  updateCart: (token, productId, payload) => request(`/users/cart/${productId}`, { method: 'PUT', token, body: payload }),
  removeCart: (token, productId) => request(`/users/cart/${productId}`, { method: 'DELETE', token }),
  clearCart: (token) => request('/users/cart', { method: 'DELETE', token }),

  createOrder: (token, payload) => request('/orders', { method: 'POST', token, body: payload }),
  myOrders: (token) => request('/orders/mine', { token }),
};

export const resolveImageUrl = (src = '') => {
  if (!src) return '/placeholder-product.svg';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
  return src.startsWith('/') ? `${API_ORIGIN}${src}` : `${API_ORIGIN}/${src}`;
};

export { API_URL, API_ORIGIN };
