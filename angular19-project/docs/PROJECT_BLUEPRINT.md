# FLOUR ON DEMAND Project Blueprint

## 1. Project Overview

**Project Name:** FLOUR ON DEMAND

**Product Type:** Multi-vendor grain grinding and flour ordering platform.

**Primary Surfaces:**

- Customer app for ordering custom grinding, readymade flour, and bulk flour.
- Admin panel for flour mill owners.
- Super-admin panel for platform operations.
- Backend API for authentication, products, orders, payments, feedback, analytics, and notifications.

**Recommended Stack:**

- Mobile: Flutter or React Native.
- Web Admin: Angular.
- Backend: Node.js + Express, .NET Core API, or Django.
- Database: PostgreSQL preferred, MySQL acceptable.
- Notifications: Firebase Cloud Messaging.
- Payments: Cash on Delivery in MVP, Razorpay or Stripe later.

## 2. Roles And Permissions

### Super Admin

Super Admin manages the full platform.

Responsibilities:

- Manage admins and users.
- View complete system activity.
- View shop, product, pricing, order, and revenue data.
- Approve, suspend, or block admin accounts.
- Monitor complaints, refunds, and feedback.
- Review analytics dashboard.

Permissions:

- Create, edit, approve, suspend, and block admins.
- View admin earnings.
- View user complaints.
- Manage refunds.
- Configure optional global pricing policies.

### Admin

Each Admin represents one flour mill or flour shop.

Responsibilities:

- Manage own shop profile.
- Manage products and pricing.
- Set grinding charges and multigrain options.
- View and update customer orders.
- Manage bulk pricing.
- Respond to customer feedback.
- View reports for daily and weekly sales.

Permissions:

- Add, update, and delete products.
- Set custom grinding charges.
- Set readymade flour pricing.
- Configure bulk pricing and discounts.
- Accept or reject orders.
- Change order status from processing through delivered.

### User

Users are customers placing flour and grinding orders.

Responsibilities:

- Create and maintain profile.
- Manage multiple addresses.
- Select shop and products.
- Place, track, and cancel orders.
- View order history.
- Rate shops and leave feedback.

## 3. Core Modules

### Authentication

Features:

- Login.
- Register.
- OTP verification.
- Forgot password.
- Role-based login.

Technical requirements:

- JWT-based authentication.
- Role-based route and API middleware.
- Password hashing.
- Mobile OTP verification through Twilio, MSG91, or equivalent provider.

### Profile Management

User profile fields:

- Name.
- Mobile number.
- Email.
- Multiple addresses.
- Profile picture.

Admin shop profile fields:

- Shop name.
- Shop address.
- GST number, optional.
- Shop timings.
- Shop image.
- Minimum order quantity.
- Minimum order value.

### Product Management

Admins can create products across three ordering tabs.

#### Custom Grain Grinding

Features:

- Select grains such as wheat, bajra, jowar, and other grains.
- Price per kg.
- Quantity selection.
- Grinding size options: very small, small, medium, extra medium.
- Multigrain additions such as chana, soyabean, and oats.
- Extra customer comments.
- Multiple grains in one order.
- Dynamic price calculation.

#### Readymade Multigrain Flour

Features:

- Select pre-made flour type.
- Fixed pricing.
- Quantity selection.
- Customer comments.

#### Bulk Order

Features:

- Orders greater than 10 kg.
- Package sizes: 1 kg, 2 kg, 5 kg, and 10 kg.
- Wholesale pricing.
- Discount logic.

### Order Management

Order status flow:

1. Order Placed.
2. Accepted.
3. Grinding in Progress.
4. Ready.
5. Out for Delivery.
6. Delivered.
7. Cancelled.

Requirements:

- Order tracking timeline UI.
- Push notifications on status changes.
- Cancellation policy.
- Admin order accept and reject actions.

### Payment System

MVP:

- Cash on Delivery.

Future phases:

- Online payment through Razorpay or Stripe.
- Wallet system.
- Refund system.

### Feedback And Ratings

Features:

- User rates admin shop from 1 to 5 stars.
- User comment section.
- Admin reply to feedback.
- Super-admin monitoring.

### Tracking

MVP:

- Manual delivery tracking through admin status updates.

Future:

- Real-time delivery tracking.

### Analytics

Super Admin dashboard:

- Total users.
- Total admins.
- Total revenue.
- Most ordered product.
- Daily orders.

Admin dashboard:

- Daily sales.
- Monthly revenue.
- Top selling product.
- Pending orders.

## 4. High-Level Data Model

Core tables:

- Users.
- Admins.
- Products.
- ProductCategories.
- Orders.
- OrderItems.
- Feedback.
- Payments.
- Addresses.
- Notifications.

Recommended additions:

- Shops.
- ShopTimings.
- ProductOptions.
- ProductAddons.
- Coupons.
- Complaints.
- Refunds.
- Subscriptions.
- InventoryItems.
- AuditLogs.

## 5. Recommended MVP Scope

Phase 1 should stay focused and shippable.

Include:

- Authentication and role routing.
- User profile and multiple addresses.
- Shop browsing.
- Admin product management.
- Custom grinding order flow.
- Readymade flour order flow.
- Bulk order flow.
- Cart and checkout.
- Cash on Delivery.
- Basic order tracking.
- Feedback and ratings.
- Basic admin and super-admin dashboards.

Defer:

- Online payments.
- Wallet.
- Refund automation.
- Real-time delivery tracking.
- AI suggestions.
- Full inventory automation.

## 6. Development Phases

### Phase 1: MVP, 45 Days

Deliver:

- Authentication.
- Admin product management.
- User order placement.
- Basic tracking.
- Cash on Delivery.
- Feedback.
- Foundational dashboards.

### Phase 2

Deliver:

- Online payments.
- Analytics expansion.
- Coupons.
- Admin subscription model.
- Refund management.

### Phase 3

Deliver:

- Real-time delivery tracking.
- AI-based order recommendations.
- Inventory automation.
- Nutrition information panel.

## 7. Recommended Improvements

- Delivery slot selection, such as 10am-12pm and 4pm-6pm.
- Minimum order value per shop.
- Admin subscription or commission model.
- Admin-specific and global coupons.
- Inventory tracking with low-stock alerts.
- Complaint system with image upload.
- Multi-language support for English, Hindi, and Marathi.

## 8. Security Considerations

- Role-based access control.
- API rate limiting.
- Secure password hashing.
- JWT expiration and refresh flow.
- Payment provider webhook validation.
- File upload validation.
- Server-side price calculation.
- Audit logs for admin and super-admin actions.
- Data encryption for sensitive records where required.

## 9. Team Task Assignment

### Backend Team

- Design database schema.
- Build auth APIs.
- Build product APIs.
- Build order APIs.
- Build role middleware.
- Integrate payment provider.
- Build notification APIs.

### Web And Mobile Team

- Build user ordering UI.
- Build admin UI.
- Build super-admin UI.
- Implement order flow.
- Integrate push notifications.
- Connect APIs.

### QA Team

- Test role access.
- Test price calculation.
- Test multigrain logic.
- Test order status transitions.
- Test cancellation rules.
- Test load and API rate behavior.

## 10. Primary UX Flows

User flow:

Login -> Select Shop -> Select Product Tab -> Customize Product -> Add to Cart -> Checkout -> Track Order -> Feedback.

Admin flow:

Login -> View Orders -> Update Status -> Manage Products -> View Reports.

Super Admin flow:

Login -> View Dashboard -> Manage Admins -> View Orders -> View Finance -> Review Reports.

## 11. Future Expansion Ideas

- Franchise model.
- B2B supply chain.
- Raw grain marketplace.
- AI diet-based flour suggestions.
- Nutrition information panel.

## 12. Manager-Level Decisions To Finalize

Before development is frozen, confirm:

- Business model: commission, subscription, or hybrid.
- Delivery model: shop delivery, platform delivery, pickup, or mixed.
- Pilot city and target languages.
- MVP payment mode.
- Cancellation and refund policy.
- Initial admin onboarding process.
