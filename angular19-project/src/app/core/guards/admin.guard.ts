import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';

@Injectable({ providedIn: 'root' })
export class AdminGuard extends AuthGuard implements CanActivate {
  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuthorization(['admin', 'superadmin']); // Superadmin can also access admin routes
  }
}