import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: 'ACTIVE'|'INACTIVE'|'BLOCKED';
  verified?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  lastOrder?: string;
  joinedOn?: string;
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  constructor(private api: ApiService) {}

  getUsers(filters?: any): Observable<{ total:number; items: UserRecord[] }> {
    const params: any = {};
    if (filters?.q) params.q = filters.q;
    return this.api.findUsers(params).pipe(map(items => ({ total: items.length, items })));
  }

  getUserDetails(userId: string): Observable<UserRecord | null> {
    return this.api.get<UserRecord>('users', userId).pipe(map(r => r || null));
  }

  blockUser(userId: string): Observable<boolean> { return this.api.patch('users', userId, { status: 'BLOCKED' }).pipe(map(() => true)); }
  unblockUser(userId: string): Observable<boolean> { return this.api.patch('users', userId, { status: 'ACTIVE' }).pipe(map(() => true)); }
  deleteUser(userId: string): Observable<boolean> { return this.api.delete('users', userId).pipe(map(() => true)); }

  getUserActivity(userId: string): Observable<any[]> { return this.api.get<any[]>(`users/${userId}/activity`).pipe(map(r => r || [])); }

  sendNotification(userId: string, message: string): Observable<boolean> { console.log('notify', userId, message); return this.api.post('notifications', { userId, message }).pipe(map(()=> true)); }
}
