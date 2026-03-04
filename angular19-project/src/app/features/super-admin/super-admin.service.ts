import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  constructor() {}

  getSystemStats(): Observable<any> {
    const stats = {
      totalUsers: 12450,
      usersGrowthPct: 3.4,
      totalAdmins: 12,
      totalShops: 345,
      totalOrders: 98765,
      totalRevenue: 12345678,
      activeShopsToday: 120,
      pendingApprovals: 7
    };
    return of(stats).pipe(delay(150));
  }

  getRevenueData(period: { from:string; to:string }): Observable<any> {
    // mock timeseries
    const series = Array.from({ length: 12 }).map((_, i) => ({ label: `M${i+1}`, value: Math.floor(Math.random()*50000)+10000 }));
    return of(series).pipe(delay(200));
  }

  getUserGrowthData(period: any): Observable<any> {
    const series = Array.from({ length: 12 }).map((_, i) => ({ label: `M${i+1}`, users: Math.floor(Math.random()*1000)+200 }));
    return of(series).pipe(delay(200));
  }

  getTopShops(limit = 5): Observable<any> {
    const shops = Array.from({ length: limit }).map((_, i) => ({ id: 's'+i, name: `Shop ${i+1}`, revenue: Math.floor(Math.random()*200000) }));
    return of(shops).pipe(delay(150));
  }

  getRecentActivities(limit = 10): Observable<any> {
    const activities = Array.from({ length: limit }).map((_, i) => ({
      id: i,
      type: ['NEW_USER','NEW_ADMIN','ORDER_HIGH_VALUE','SYSTEM_ALERT'][i%4],
      message: `Sample activity ${i+1}`,
      ts: new Date(Date.now() - i*60000).toISOString()
    }));
    return of(activities).pipe(delay(120));
  }

  getPendingApprovals(): Observable<any> {
    const approvals = [{ id: 'req1', type: 'SHOP_VERIFICATION', name: 'Shop A' }, { id: 'req2', type: 'ADMIN_REQUEST', name: 'Admin B' }];
    return of(approvals).pipe(delay(120));
  }
}
