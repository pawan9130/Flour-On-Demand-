import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';

@Injectable({ providedIn: 'root' })
export class UserGuard extends AuthGuard implements CanActivate {
  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuthorization(['user', 'admin', 'superadmin']); // All roles can access user routes? Adjust as needed
  }
}