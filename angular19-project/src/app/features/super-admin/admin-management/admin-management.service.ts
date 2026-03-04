import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shopName?: string;
  status?: 'ACTIVE'|'PENDING'|'SUSPENDED'|'INACTIVE';
  verified?: boolean;
  joinedOn?: string;
  totalOrders?: number;
  totalRevenue?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminManagementService {
  constructor(private api: ApiService) {}

  getAdmins(filters?: any): Observable<{ total: number; items: AdminRecord[] }> {
    // json-server supports ?q= full-text search; we'll map filters
    const params: any = {};
    if (filters?.q) params.q = filters.q;
    return this.api.findAdmins(params).pipe(map(items => ({ total: items.length, items })));
  }

  getAdminDetails(adminId: string): Observable<AdminRecord | null> {
    return this.api.get<AdminRecord>('admins', adminId).pipe(map(r => r || null));
  }

  addAdmin(data: Partial<AdminRecord>): Observable<AdminRecord> {
    return this.api.post ? this.api.post('admins', data) : this.api.get('admins');
  }

  updateAdmin(adminId: string, data: Partial<AdminRecord>): Observable<AdminRecord | null> {
    return this.api.patch('admins', adminId, data).pipe(map(r => r || null));
  }

  approveAdmin(adminId: string): Observable<boolean> {
    return this.updateAdmin(adminId, { status: 'ACTIVE', verified: true }).pipe(map(r => !!r));
  }

  suspendAdmin(adminId: string): Observable<boolean> {
    return this.updateAdmin(adminId, { status: 'SUSPENDED' }).pipe(map(r => !!r));
  }

  deleteAdmin(adminId: string): Observable<boolean> {
    return this.api.delete('admins', adminId).pipe(map(() => true));
  }

  getAdminEarnings(adminId: string, period?: any): Observable<any> {
    return this.api.get<any>('admins', adminId).pipe(map(() => ({ totalEarnings: 0, payouts: [] })));
  }
}
