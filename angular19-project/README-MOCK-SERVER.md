# Mock JSON Server (app backend)

This project includes a lightweight mock backend using `db.json` and `server.js`.

What was added/updated

- `db.json` now contains realistic sample data: `products`, `categories`, `users`, `admins`, `orders`, `carts`, `feedback`, and `settings`.
- `server.js` is a wrapper over `json-server` and exposes convenience endpoints:
  - `POST /auth/login` - login with email/password (mock token `user-{id}`)
  - `POST /auth/register` - register new user
  - `GET /cart/:userId`, `POST /cart/:userId`, `PUT /cart/:userId`, `DELETE /cart/:userId/items/:productId`
  - `POST /orders` - creates an order (requires Authorization header `Bearer user-{id}`)
  - `GET /me` - get current user by token
  - All default `json-server` CRUD endpoints are available (`/products`, `/users`, `/admins`, `/orders`, etc.)

Quick setup

1. Install dependencies (install `json-server` and `nodemon` if you want auto-reload):

```bash
npm install
npm install --save-dev json-server nodemon
```

2. Start the mock server (two options):

- Plain json-server (watches `db.json` automatically):

```bash
npm run mock:server
```

- Custom wrapper with nodemon (restarts `server.js` on changes):

```bash
npm run mock:server:reload
```

3. API base URL

- Default: `http://localhost:3001`
- This is configured in `.env` via `API_BASE_URL`.

Example requests

- Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha@example.com","password":"password1"}'
```

- Get products

```bash
curl http://localhost:3001/products
```

- Create order (authenticated)

```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer user-1" \
  -d '{"items":[{"productId":1,"qty":1}], "paymentMethod":"COD", "addressId":1 }'
```

Notes

- Passwords in `db.json` are plain-text for the mock; do NOT use real credentials.
- Token scheme is a simple `user-{id}` format to simplify client integration; you can replace it with JWT later.
- If your frontend integrates with `src/services/api.js`, it already targets `http://localhost:3001` by default.

If you want, I can:
- Convert `src/services/api.js` to an Angular `ApiService` injectable (TypeScript) and wire it into the existing components.
- Generate placeholder admin/product/user screens in the Angular app that call these endpoints (I can scaffold simple components and routes).

Tell me which of the two follow-ups you want next.