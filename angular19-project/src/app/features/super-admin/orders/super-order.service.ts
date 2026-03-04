import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface SuperOrder {
  id: string;
  placedAt: string;
  customerName: string;
  shopName: string;
  itemsSummary: string;
  amount: number;
  status: string;
  paymentMethod?: string;
}

@Injectable({ providedIn: 'root' })
export class SuperOrderService {
  private orders: SuperOrder[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `ORD-${1000 + i}`,
    placedAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    customerName: `Customer ${i+1}`,
    shopName: `Shop ${((i%5)+1)}`,
    itemsSummary: `${Math.floor(Math.random()*5)+1} items`,
    amount: Math.floor(Math.random()*2000)+100,
    status: ['PLACED','ACCEPTED','PROCESSING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'][i%6],
    paymentMethod: i%2===0 ? 'UPI' : 'COD'
  }));

  constructor() {}

  getAllOrders(filters?: any): Observable<{ total:number; items: SuperOrder[] }> {
    // basic filtering mock
    let items = [...this.orders];
    if (filters?.q) items = items.filter(o => o.id.includes(filters.q) || o.customerName.toLowerCase().includes(filters.q.toLowerCase()));
    return of({ total: items.length, items }).pipe(delay(180));
  }

  getOrderDetails(orderId: string): Observable<SuperOrder | null> {
    const o = this.orders.find(x=>x.id===orderId) || null;
    return of(o).pipe(delay(120));
  }

  overrideOrderStatus(orderId: string, status: string, reason?: string): Observable<boolean> {
    const idx = this.orders.findIndex(x=>x.id===orderId);
    if (idx!==-1){ this.orders[idx].status = status; return of(true).pipe(delay(120)); }
    return of(false).pipe(delay(80));
  }

  getRefundRequests(): Observable<any[]> {
    const refunds = [{ orderId: 'ORD-1001', customer: 'Customer 2', amount: 250, reason: 'Item missing', status: 'PENDING' }];
    return of(refunds).pipe(delay(140));
  }

  processRefund(data:any): Observable<boolean> { console.log('mock process refund', data); return of(true).pipe(delay(150)); }

  getOrderAnalytics(period?: any): Observable<any> {
    const analytics = { hourly: [], daily: [], metrics: { totalOrders: this.orders.length, totalRevenue: this.orders.reduce((s,o)=>s+o.amount,0) } };
    return of(analytics).pipe(delay(180));
  }
}
