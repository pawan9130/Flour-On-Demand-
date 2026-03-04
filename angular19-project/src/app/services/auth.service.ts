import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { User } from '../models/user';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

export type AuthRole = 'superadmin' | 'admin' | 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: { userId: string; password: string }): Observable<{ 
    user: any; 
    role: AuthRole; 
    token: string; 
    message: string;
    redirectUrl: string;
  }> {
    const identifier = credentials.userId;
    const password = credentials.password;

    // First check superadmins (separate collection)
    return this.checkSuperAdmin(identifier, password).pipe(
      switchMap(result => {
        if (result) return of(result);

        // Then check admins
        return this.checkAdmin(identifier, password).pipe(
          switchMap(adminResult => {
            if (adminResult) return of(adminResult);

            // Finally check regular users
            return this.checkUser(identifier, password);
          })
        );
      }),
      catchError(err => {
        console.error('Login error:', err);
        return throwError(() => new Error('Invalid credentials or server error'));
      })
    );
  }

  private checkSuperAdmin(identifier: string, password: string): Observable<any | null> {
    // Try to find by email first, then by userId
    const query = identifier.includes('@') 
      ? { email: identifier, password } 
      : { userId: identifier, password };

    return this.api.findSuperAdmins(query).pipe(
      map(superAdmins => {
        if (superAdmins && superAdmins.length > 0) {
          const sa = superAdmins[0];
          const role: AuthRole = 'superadmin';
          const userProfile = { 
            ...sa, 
            role,
            dashboardRoute: '/super-admin/dashboard'
          };
          
          this.setUserSession(userProfile, `superadmin-${sa.id}`);
          
          return { 
            user: userProfile, 
            role, 
            token: `superadmin-${sa.id}`,
            message: 'Super Admin login successful',
            redirectUrl: '/super-admin/dashboard'
          };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  private checkAdmin(identifier: string, password: string): Observable<any | null> {
    const query = identifier.includes('@') 
      ? { email: identifier, password } 
      : { userId: identifier, password };

    return this.api.findAdmins(query).pipe(
      map(admins => {
        if (admins && admins.length > 0) {
          const admin = admins[0];
          // Enforce activation: admin must have status ACTIVE to login
          const status = (admin.status || '').toString().toUpperCase();
          if (status !== 'ACTIVE') {
            if (status === 'SUSPENDED') {
              throw new Error('Your account is suspended. Please contact the Super Admin.');
            }
            throw new Error('Your account is not activated. Please contact the Super Admin and request activation.');
          }

          const role: AuthRole = admin.role === 'superadmin' ? 'superadmin' : 'admin';
          const userProfile = { 
            ...admin, 
            role,
            dashboardRoute: role === 'superadmin' ? '/super-admin/dashboard' : '/admin/dashboard'
          };
          
          this.setUserSession(userProfile, `admin-${admin.id}`);
          
          return { 
            user: userProfile, 
            role, 
            token: `admin-${admin.id}`,
            message: 'Admin login successful',
            redirectUrl: role === 'superadmin' ? '/super-admin/dashboard' : '/admin/dashboard'
          };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  private checkUser(identifier: string, password: string): Observable<any> {
    // Users typically login with email
    return this.api.findUsers({ email: identifier, password }).pipe(
      map(users => {
        if (users && users.length > 0) {
          const user = users[0];
          const role: AuthRole = 'user';
          const userProfile = { 
            ...user, 
            role,
            dashboardRoute: '/user/dashboard'
          };
          
          this.setUserSession(userProfile, `user-${user.id}`);
          
          return { 
            user: userProfile, 
            role, 
            token: `user-${user.id}`,
            message: 'Login successful',
            redirectUrl: '/user/dashboard'
          };
        }
        throw new Error('Invalid email or password');
      })
    );
  }

  private setUserSession(user: any, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', user.role);
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(payload: any): Observable<any> {
    const name = payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
    const body = { ...payload, name };
    return this.api.createUser(body).pipe(
      map((created: any) => {
        const userProfile = { ...created, role: 'user', dashboardRoute: '/user/dashboard' };
        const token = `user-${created.id}`;
        this.setUserSession(userProfile, token);
        return { user: userProfile, token, message: 'Registration successful', redirectUrl: '/user/dashboard' };
      })
    );
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): any | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): AuthRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  hasRole(roles: AuthRole | AuthRole[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return userRole === roles;
  }
}