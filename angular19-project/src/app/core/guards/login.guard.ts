import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const LoginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) {
    // Redirect logged-in users away from login
    const user = auth.getCurrentUser();
    const role = user?.role;
    if (role && role.toString().toLowerCase().includes('super')) {
      router.navigate(['/super-admin/dashboard']);
    } else if (role && role.toString().toLowerCase().includes('admin')) {
      router.navigate(['/admin/dashboard']);
    } else if (role && role.toString().toLowerCase().includes('user')) {
      router.navigate(['/user/dashboard']);
    } else {
      router.navigate(['/orders']);
    }
    return false;
  }
  return true;
};
