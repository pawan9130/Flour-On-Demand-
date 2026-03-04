import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LoginGuard } from './core/guards/login.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'user' },

  // Auth
  { path: 'login', canActivate: [LoginGuard], loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule), data: { animation: 'LoginPage' } },

  // User area (lazy module)
  { path: 'user', canActivate: [AuthGuard, RoleGuard], data: { role: 'USER', animation: 'UserArea' }, loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },

  // Admin area
  { path: 'admin', canActivate: [AuthGuard, RoleGuard], data: { role: 'ADMIN', animation: 'AdminArea' }, loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },

  // Super admin area
  { path: 'super-admin', canActivate: [AuthGuard, RoleGuard], data: { role: 'SUPER_ADMIN', animation: 'SuperAdminArea' }, loadChildren: () => import('./features/super-admin/super-admin.module').then(m => m.SuperAdminModule) },

  // Fallback / 404
  { path: 'not-found', loadComponent: () => import('./components/not-found/not-found.component').then(c => c.NotFoundComponent) },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 80]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
