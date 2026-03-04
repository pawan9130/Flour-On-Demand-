import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor() {}

  getDashboardStats(): Observable<any> {
    return of({ todaysOrders: 12, todaysRevenue: 1240, pendingOrders: 3, totalProducts: 56, avgRating: 4.4 });
  }

  getSalesData(period: string = '7d'): Observable<any> {
    return of({ labels: ['day1','day2','day3'], data: [100,120,90] });
  }

  getTopProducts(limit = 5): Observable<any[]> {
    return of([{ name: 'Premium Wheat', sold: 24 }, { name: 'Sattu Mix', sold: 10 }]);
  }

  getRecentOrders(limit = 10): Observable<any[]> {
    return of([]);
  }
}
