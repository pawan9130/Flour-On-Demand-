import { Injectable } from '@angular/core';
import { Router, UrlTree, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, AuthRole } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(protected auth: AuthService, protected router: Router) {}

  // Basic canActivate used when route lists AuthGuard directly: ensure authenticated
  canActivate(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): boolean | UrlTree {
    if (!this.auth.isLoggedIn()) {
      return this.router.parseUrl('/login');
    }
    return true;
  }

  protected checkAuthorization(allowedRoles: AuthRole[] = []): boolean | UrlTree {
    if (!this.auth.isLoggedIn()) {
      return this.router.parseUrl('/login');
    }

    const userRole = this.auth.getUserRole();
    
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirect to appropriate dashboard based on role (use hyphenated route names)
    switch(userRole) {
      case 'superadmin':
        return this.router.parseUrl('/super-admin/dashboard');
      case 'admin':
        return this.router.parseUrl('/admin/dashboard');
      case 'user':
        return this.router.parseUrl('/user/dashboard');
      default:
        return this.router.parseUrl('/login');
    }
  }
}