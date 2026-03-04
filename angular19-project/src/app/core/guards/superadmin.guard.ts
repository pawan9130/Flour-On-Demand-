import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';

@Injectable({ providedIn: 'root' })
export class SuperAdminGuard extends AuthGuard implements CanActivate {
 override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuthorization(['superadmin']);
  }
}

