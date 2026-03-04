/* src/services/api.js
 * Minimal API service wrapper compatible with the mock JSON server and future real API.
 * Features:
 * - Uses `API_BASE_URL` from environment or defaults to http://localhost:3001
 * - Exposes `loading` flag and simple request helpers
 * - Provides specific helpers: login, register, products, cart, orders
 * - Handles JSON errors and returns { ok, status, data, error }
 */

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) ||
  (typeof window !== 'undefined' && window.__env && window.__env.API_BASE_URL) ||
  'http://localhost:3001';

const api = {
  loading: false,
};

function buildUrl(path, params) {
  let url = (path.startsWith('http') ? path : `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`);
  if (params && typeof params === 'object') {
    const qs = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }
  return url;
}

async function request(method, path, { params, body, headers } = {}) {
  api.loading = true;
  const url = buildUrl(path, params);
  const opts = { method, headers: { 'Content-Type': 'application/json', ...(headers || {}) } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) {
      return { ok: false, status: res.status, data: null, error: data || { message: res.statusText } };
    }
    return { ok: true, status: res.status, data, error: null };
  } catch (err) {
    return { ok: false, status: 0, data: null, error: { message: err.message || 'Network error' } };
  } finally {
    api.loading = false;
  }
}

// Authentication
async function login(email, password) {
  return request('POST', '/auth/login', { body: { email, password } });
}

async function register(name, email, password) {
  return request('POST', '/auth/register', { body: { name, email, password } });
}

// Products
async function getProducts(params) {
  return request('GET', '/products', { params });
}

async function getProduct(id) {
  return request('GET', `/products/${id}`);
}

// Cart
async function getCart(userId) {
  return request('GET', `/cart/${userId}`);
}

async function addToCart(userId, productId, qty) {
  return request('POST', `/cart/${userId}`, { body: { productId, qty } });
}

async function updateCart(userId, items) {
  return request('PUT', `/cart/${userId}`, { body: { items } });
}

async function removeCartItem(userId, productId) {
  return request('DELETE', `/cart/${userId}/items/${productId}`);
}

// Orders
async function createOrder(token, { items, paymentMethod, addressId }) {
  // token will be passed as Authorization header
  return request('POST', '/orders', { body: { items, paymentMethod, addressId }, headers: { Authorization: token } });
}

async function getOrders(params) {
  return request('GET', '/orders', { params });
}

module.exports = {
  api,
  login,
  register,
  getProducts,
  getProduct,
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  createOrder,
  getOrders
};
