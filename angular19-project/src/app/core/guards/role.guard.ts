import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as string | undefined;

  const user = auth.getCurrentUser();
  const role = user?.role || (user?.roleName ?? null) || null;

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!requiredRole) return true;

  // support several role naming formats (SUPER_ADMIN, superadmin, ADMIN, admin)
  const normalize = (r: string) => r?.toString().toLowerCase().replace(/[^a-z]/g, '');
  // map common backend role aliases to canonical roles used in routes
  const mapAlias = (r: string | null) => {
    const v = normalize(r || '');
    if (!v) return v;
    if (v === 'customer' || v === 'client' || v === 'buyer') return 'user';
    if (v === 'superadmin' || v === 'super' || v === 'super_admin' || v === 'superadmin') return 'superadmin';
    return v;
  };

  // Debug logging to help diagnose role mismatches at runtime
  try {
    // eslint-disable-next-line no-console
    console.log('[RoleGuard] isLoggedIn=', auth.isLoggedIn(), 'userRole=', role, 'requiredRole=', requiredRole, 'mappedUser=', mapAlias(role), 'mappedRequired=', mapAlias(requiredRole));
  } catch (e) {}

  if (mapAlias(role) === mapAlias(requiredRole)) return true;

  router.navigate(['/login']);
  return false;
};
