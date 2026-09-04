import { Routes } from '@angular/router';
// import { OrdersComponent } from './components/orders/orders.component';
// import { SignupComponent } from './components/signup/signup.component';
// import { FlourOrderComponent } from './components/flour-order/flour-order.component';
// import { BulkOrderComponent } from './components/bulk-order/bulk-order.component';
// import { MilletGrindingComponent } from './components/millet-grinding/millet-grinding.component';
// import { OtherOrderComponent } from './components/other-order/other-order.component';
// import { SelectAdminComponent } from './components/select-admin/select-admin.component';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LoginGuard } from './core/guards/login.guard';
import { UserLayoutComponent } from './features/user/layout/user-layout.component';
import { UserDashboardComponent } from './features/user/dashboard/user-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent), canActivate: [LoginGuard] },
  // { path: 'signup', component: SignupComponent },
  // { path: 'orders', component: OrdersComponent },
  // { path: 'select-admin', component: SelectAdminComponent },

  // Admin area (requires ADMIN role)
  { path: 'admin', loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent), canActivate: [AuthGuard, RoleGuard], data: { role: 'ADMIN' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'orders', loadComponent: () => import('./features/admin/orders/order-list/admin-order-list.component').then(m => m.AdminOrderListComponent) },
      { path: 'shop', loadComponent: () => import('./features/admin/shop/shop-profile/shop-profile.component').then(m => m.ShopProfileComponent) },
      { path: 'shop/settings', loadComponent: () => import('./features/admin/shop/shop-settings/shop-settings.component').then(m => m.ShopSettingsComponent) },
      { path: 'products', loadComponent: () => import('./features/admin/products/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'products/add', loadComponent: () => import('./features/admin/products/add-product/add-product.component').then(m => m.AddProductComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/add-product/add-product.component').then(m => m.AddProductComponent) },
      { path: 'order/:id', loadComponent: () => import('./features/admin/orders/order-details/admin-order-details.component').then(m => m.AdminOrderDetailsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Super-admin area (requires SUPER_ADMIN role)
  { path: 'super-admin', loadComponent: () => import('./features/super-admin/layout/super-layout.component').then(m => m.SuperLayoutComponent), canActivate: [AuthGuard, RoleGuard], data: { role: 'SUPER_ADMIN' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/super-admin/dashboard/super-dashboard.component').then(m => m.SuperDashboardComponent) },
      { path: 'admins', loadComponent: () => import('./features/super-admin/admin-management/admin-list/admin-list.component').then(m => m.AdminListComponent) },
      { path: 'admins/add', loadComponent: () => import('./features/super-admin/admin-management/add-admin/add-admin.component').then(m => m.AddAdminComponent) },
      { path: 'admins/:id', loadComponent: () => import('./features/super-admin/admin-management/admin-details/admin-details.component').then(m => m.AdminDetailsComponent) },
      { path: 'admins/approve', loadComponent: () => import('./features/super-admin/admin-management/approve-admin/approve-admin.component').then(m => m.ApproveAdminComponent) },
      { path: 'finance', loadComponent: () => import('./features/super-admin/finance/revenue-dashboard/revenue-dashboard.component').then(m => m.RevenueDashboardComponent) },
      { path: 'orders', loadComponent: () => import('./features/super-admin/orders/all-orders/all-orders.component').then(m => m.AllOrdersComponent) },
      { path: 'settings', loadComponent: () => import('./features/super-admin/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'users', loadComponent: () => import('./features/super-admin/user-management/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // User area
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'USER' },
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'browse', loadComponent: () => import('./features/user/shops/shop-list/shop-list.component').then(m => m.ShopListComponent) },
      { path: 'shop/:id', loadComponent: () => import('./features/user/shops/shop-details/shop-details.component').then(m => m.ShopDetailsComponent) },
      { path: 'cart', loadComponent: () => import('./features/user/cart/cart/cart.component').then(m => m.CartComponent) },
      { path: 'wishlist', loadComponent: () => import('./features/user/wishlist/wishlist-list.component').then(m => m.UserWishlistListComponent) },
      { path: 'checkout', loadComponent: () => import('./features/user/cart/checkout/checkout.component').then(m => m.CheckoutComponent) },
      { path: 'orders', loadComponent: () => import('./features/user/orders/order-list/order-list.component').then(m => m.OrderListComponent) },
      { path: 'order/:id', loadComponent: () => import('./features/user/orders/order-details/order-details.component').then(m => m.OrderDetailsComponent) },
      { path: 'flour-order', loadComponent: () => import('./components/flour-order/admin-list.component').then(m => m.AdminListComponent) },
      { path: 'custom-flour-order', loadComponent: () => import('./features/user/custom-grinding/custom-grinding.component').then(m => m.CustomGrindingComponent) },
      { path: 'flour-order/admin/:id', loadComponent: () => import('./components/flour-order/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'order/:productId', loadComponent: () => import('./components/order-page/order-page.component').then(m => m.OrderPageComponent) },
      { path: 'order/status/:orderId', loadComponent: () => import('./components/order-status/order-status.component').then(m => m.OrderStatusComponent) },
      { path: 'profile', loadComponent: () => import('./features/user/profile/profile/profile.component').then(m => m.ProfileComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // { path: 'flour-order', component: FlourOrderComponent },
  // { path: 'bulk-order', component: BulkOrderComponent },
  // { path: 'millet-grinding', component: MilletGrindingComponent },
  // { path: 'other-order', component: OtherOrderComponent },
  // { path: 'order/:productId', loadComponent: () => import('./components/order-page/order-page.component').then(m => m.OrderPageComponent) },
  // { path: 'order/status/:orderId', loadComponent: () => import('./components/order-status/order-status.component').then(m => m.OrderStatusComponent) },
  // { path: '**', redirectTo: '/orders' }
];
