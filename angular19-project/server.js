// server.js
// Custom json-server wrapper for the mock shopping API
// - Provides /auth/login and /auth/register
// - Provides cart endpoints (GET/POST/PUT/DELETE)
// - Provides order creation endpoint which deducts stock and clears cart
// Usage: node server.js  (or use npm script "mock:server:reload" with nodemon)

const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ static: './public' });

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Simple token format: 'user-{id}' returned on login/register
function makeTokenForUser(user, type = 'user') {
  return `${type}-${user.id}`;
}

function getUserFromToken(token) {
  if (!token) return null;
  const s = token.toString();
  const m = s.match(/^(user|admin)-(\d+)$/);
  if (!m) return null;
  const type = m[1];
  const id = Number(m[2]);
  // Prefer using the json-server router DB (lowdb) so we don't read files directly
  try {
    const db = router.db; // lowdb instance
    if (type === 'admin') return db.get('admins').find({ id }).value() || null;
    return db.get('users').find({ id }).value() || null;
  } catch (e) {
    // As a very last resort, try reading the file (shouldn't be necessary)
    try {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
      if (type === 'admin') return (data.admins || []).find(a => Number(a.id) === id) || null;
      return (data.users || []).find(u => Number(u.id) === id) || null;
    } catch (err) {
      return null;
    }
  }
}

function getRequestToken(req) {
  const authHeader = req.headers.authorization || req.query.token || '';
  return authHeader.replace(/^Bearer\s+/i, '') || authHeader;
}

function isAdminProductRequest(req) {
  return /^(admin|superadmin)-/.test(getRequestToken(req));
}

// CORS-friendly response for unknown routes
server.use((req, res, next) => {
  // allow client to read Authorization header
  res.header('Access-Control-Expose-Headers', 'Authorization');
  next();
}); 

// Auth: login
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  // lookup via the json-server router DB (no direct file reads)
  const db = router.db;
  // try users collection first
  let user = db.get('users').find({ email }).value();
  let type = 'user';
  if (!user) {
    // try admins collection
    user = db.get('admins').find({ email }).value();
    type = 'admin';
  }
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  // NOTE: passwords in the mock DB are plain text for demo simplicity
  if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = makeTokenForUser(user, type);
  // return profile minus password
  const { password: _pw, ...profile } = user;
  res.setHeader('Authorization', `Bearer ${token}`);
  return res.json({ token, user: profile });
});

// Auth: register
server.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing required fields' });
  const db = router.db;
  const existing = db.get('users').find({ email }).value();
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const users = db.get('users').value();
  const id = (users.reduce((m, u) => Math.max(m, u.id || 0), 0) || 0) + 1;
  const user = { id, email, password, name, role: 'customer', addresses: [], cart: [] };
  db.get('users').push(user).write();
  const token = makeTokenForUser(user);
  res.setHeader('Authorization', `Bearer ${token}`);
  const { password: _pw, ...profile } = user;
  return res.status(201).json({ token, user: profile });
});

// Middleware to protect routes that require auth (cart, orders)
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.query.token || '';
  const token = authHeader.replace(/^Bearer\s+/i, '') || authHeader;
  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}

// Cart endpoints (use router.db to persist)
server.get('/cart/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const db = router.db;
  const cart = db.get('carts').find({ userId }).value() || { id: null, userId, items: [] };
  res.json(cart.items || []);
});

server.post('/cart/:userId', (req, res) => {
  // add/update an item
  const userId = Number(req.params.userId);
  const { productId, qty } = req.body || {};
  if (!productId || typeof qty !== 'number') return res.status(400).json({ error: 'productId and qty required' });
  const db = router.db;
  let cart = db.get('carts').find({ userId }).value();
  if (!cart) {
    const cid = (db.get('carts').map('id').value().reduce((m, v) => Math.max(m, v || 0), 0) || 0) + 1;
    cart = { id: cid, userId, items: [] };
    db.get('carts').push(cart).write();
  }
  const existing = db.get('carts').find({ userId }).get('items').find({ productId }).value();
  if (existing) {
    db.get('carts').find({ userId }).get('items').find({ productId }).assign({ qty }).write();
  } else {
    db.get('carts').find({ userId }).get('items').push({ productId, qty }).write();
  }
  const updated = db.get('carts').find({ userId }).value();
  res.json(updated.items);
});

server.put('/cart/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const { items } = req.body || {};
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
  const db = router.db;
  let cart = db.get('carts').find({ userId }).value();
  if (!cart) {
    const cid = (db.get('carts').map('id').value().reduce((m, v) => Math.max(m, v || 0), 0) || 0) + 1;
    cart = { id: cid, userId, items };
    db.get('carts').push(cart).write();
  } else {
    db.get('carts').find({ userId }).assign({ items }).write();
  }
  res.json(items);
});

server.delete('/cart/:userId/items/:productId', (req, res) => {
  const userId = Number(req.params.userId);
  const productId = Number(req.params.productId);
  const db = router.db;
  const cart = db.get('carts').find({ userId }).value();
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  db.get('carts').find({ userId }).get('items').remove(i => i.productId === productId).write();
  const updated = db.get('carts').find({ userId }).value();
  res.json(updated.items);
});

// Create order: requires auth (token) and will deduct product stock and clear cart
server.post('/orders', requireAuth, (req, res) => {
  const db = router.db;
  const user = req.user;
  const { items, paymentMethod, addressId } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Order items required' });

  // validate stock and compute totals
  let total = 0;
  for (const it of items) {
    const prod = db.get('products').find({ id: it.productId }).value();
    if (!prod) return res.status(400).json({ error: `Product ${it.productId} not found` });
    if (String(prod.status || 'active').toLowerCase() !== 'active') {
      return res.status(400).json({ error: `${prod.name} is currently unavailable` });
    }
    if (req.body.customFlour && String(prod.adminId ?? prod.shopOwnerId ?? '') !== String(req.body.adminId ?? '')) {
      return res.status(400).json({ error: `${prod.name} is not sold by the selected flour owner` });
    }
    if (req.body.customFlour) {
      const type = String(prod.productType || prod.category || '').toLowerCase().replace(/[-_\s]+/g, '');
      if (!['customflourproduct', 'customflour', 'customgrinding'].includes(type)) {
        return res.status(400).json({ error: `${prod.name} is not a custom flour ingredient` });
      }
    }
    if (prod.stock < it.qty) return res.status(400).json({ error: `Insufficient stock for ${prod.name}` });
    total += (prod.price * it.qty);
  }

  if (Math.abs(total - Number(req.body.total || 0)) > 0.01) {
    return res.status(400).json({ error: 'Order total does not match current product prices' });
  }

  // deduct stock
  items.forEach(it => {
    db.get('products').find({ id: it.productId }).assign({ stock: db.get('products').find({ id: it.productId }).value().stock - it.qty }).write();
  });

  const orders = db.get('orders').value();
  const id = (orders.reduce((m, o) => Math.max(m, o.id || 0), 0) || 1000) + 1;
  const orderId = `ORD-${id}`;
  const order = { id, orderId, userId: user.id, items, total, status: 'placed', placedAt: new Date().toISOString(), addressId, paymentMethod };
  db.get('orders').push(order).write();

  // clear user's cart
  if (db.get('carts').find({ userId: user.id }).value()) {
    db.get('carts').find({ userId: user.id }).assign({ items: [] }).write();
  }

  res.status(201).json(order);
});

// User-facing product reads must never expose inactive products. Admin requests
// retain the complete catalog so products can be reactivated.
server.get('/products', (req, res) => {
  let products = router.db.get('products').value() || [];

  if (!isAdminProductRequest(req)) {
    products = products.filter(product => String(product.status || 'active').toLowerCase() === 'active');
  }

  if (req.query.adminId != null) {
    products = products.filter(product => String(product.adminId ?? product.shopOwnerId ?? '') === String(req.query.adminId));
  }

  res.json(products);
});

server.get('/products/:id', (req, res) => {
  const product = router.db.get('products').find({ id: req.params.id }).value();
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!isAdminProductRequest(req) && String(product.status || 'active').toLowerCase() !== 'active') {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

server.post('/products', (req, res) => {
  const db = router.db;
  const body = { ...(req.body || {}) };
  const rawType = String(body.productType || body.category || 'ReadyMade').trim().toLowerCase().replace(/[-_\s]+/g, '');
  const productType = rawType === 'bulk' || rawType === 'bulkorder'
    ? 'Bulk'
    : rawType === 'customflourproduct' || rawType === 'customflour' || rawType === 'customgrinding'
      ? 'CustomFlourProduct'
      : 'ReadyMade';
  body.productType = productType;
  if (!body.category) body.category = productType === 'Bulk' ? 'bulk' : productType === 'CustomFlourProduct' ? 'custom-flour-product' : 'readymade';
  if (body.status == null) body.status = 'active';
  if (body.id == null) body.id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  db.get('products').push(body).write();
  res.status(201).json(body);
});

server.patch('/products/:id', (req, res) => {
  const db = router.db;
  const product = db.get('products').find(item => String(item.id) === String(req.params.id)).value();
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const body = { ...(req.body || {}) };
  const productType = body.productType || product.productType || product.category || 'ReadyMade';
  const normalizedType = productType.toString().trim().toLowerCase().replace(/[-_\s]+/g, '');
  const canonicalType = normalizedType === 'bulk' || normalizedType === 'bulkorder'
    ? 'Bulk'
    : normalizedType === 'customflourproduct' || normalizedType === 'customflour' || normalizedType === 'customgrinding' || normalizedType === 'custom'
      ? 'CustomFlourProduct'
      : 'ReadyMade';

  body.productType = canonicalType;
  if (!body.category) body.category = canonicalType === 'Bulk' ? 'bulk' : canonicalType === 'CustomFlourProduct' ? 'custom-flour-product' : 'readymade';
  db.get('products').find(item => String(item.id) === String(req.params.id)).assign(body).write();
  res.json(db.get('products').find(item => String(item.id) === String(req.params.id)).value());
});

// Image upload endpoint (accepts base64 payload)
server.post('/upload-image', (req, res) => {
  const { filename, data } = req.body || {};
  if (!filename || !data) return res.status(400).json({ error: 'filename and data required' });
  try {
    // prepare directory
    const uploadsDir = path.join(__dirname, 'public', 'assets', 'shops');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    // data is expected to be data:<mime>;base64,<base64data>
    const parts = data.split(',');
    const b64 = parts.length > 1 ? parts[1] : parts[0];
    const buffer = Buffer.from(b64, 'base64');
    const savePath = path.join(uploadsDir, filename);
    fs.writeFileSync(savePath, buffer);
    const host = req.get('host');
    const proto = req.protocol || 'http';
    const url = `${proto}://${host}/assets/shops/${filename}`;
    return res.json({ url });
  } catch (err) {
    console.error('Upload failed', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// simple endpoint to get current user by token
server.get('/me', (req, res) => {
  const authHeader = req.headers.authorization || req.query.token || '';
  const token = authHeader.replace(/^Bearer\s+/i, '') || authHeader;
  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const { password, ...profile } = user;
  res.json(profile);
});

// Fallback to json-server router for CRUD operations
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Mock server (json-server) running at http://localhost:${port}`);
});
