# FLOUR ON DEMAND

FLOUR ON DEMAND is an Angular 19 web application for a multi-vendor grain grinding and flour ordering platform. The workspace includes user, admin, and super-admin surfaces for shop browsing, product management, ordering, tracking, feedback, finance, and platform operations.

See the full product blueprint in [docs/PROJECT_BLUEPRINT.md](docs/PROJECT_BLUEPRINT.md).

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Mock API Server

The project includes a JSON-backed mock API for local development:

```bash
npm run mock:server
```

For auto-reloading mock API development:

```bash
npm run mock:server:reload
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

## Product Areas

- User app: shop browsing, custom grinding, cart, checkout, orders, profile, feedback.
- Admin app: dashboard, shop profile, products, order management, reports.
- Super-admin app: dashboard, admin management, user management, all orders, finance, settings.

## Suggested MVP

- Role-based authentication.
- Admin product management.
- User order placement.
- Basic order tracking.
- Cash on Delivery.
- Feedback and ratings.
- Basic dashboards.
