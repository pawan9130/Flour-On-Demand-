import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface OrderItem { id: string; name: string; qty: number; price: number; details?: any }

export interface OrderRecord {
  orderId: number;
  shopName: string;
  shopId?: number;
  date: string;
  items: OrderItem[];
  total: number;
  status: string; // placed, accepted, grinding, ready, out, delivered, cancelled
  deliveryAddress?: any;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private mockOrders: OrderRecord[] = [
    {
      orderId: 1001,
      shopName: 'Maa Flour Store',
      shopId: 1,
      date: '2026-02-10T10:15:00',
      items: [{ id: 'p1', name: 'Premium Wheat', qty: 2, price: 180 }],
      total: 360,
      status: 'delivered',
      deliveryAddress: { name: 'Asha', phone: '9000000000', line1: '123 Demo St' }
    },
    {
      orderId: 1002,
      shopName: 'Govind Grains',
      shopId: 2,
      date: '2026-02-15T12:30:00',
      items: [{ id: 'p3', name: 'Millet Flour', qty: 1, price: 120 }],
      total: 120,
      status: 'grinding',
      deliveryAddress: { name: 'Asha', phone: '9000000000', line1: '123 Demo St' }
    }
  ];

  constructor() {}

  placeOrder(order: any): Observable<{ success: boolean; orderId?: number }> {
    const id = Math.floor(10000 + Math.random() * 90000);
    const rec: OrderRecord = {
      orderId: id,
      shopName: order.items?.[0]?.shopName || 'Unknown',
      shopId: order.items?.[0]?.shopId,
      date: new Date().toISOString(),
      items: order.items || [],
      total: order.items?.reduce((s: number, it: any) => s + ((it.price || 0) * (it.qty || 1)), 0) || 0,
      status: 'placed',
      deliveryAddress: order.address
    };
    this.mockOrders.unshift(rec);
    return of({ success: true, orderId: id });
  }

  getUserOrders(filters?: any): Observable<OrderRecord[]> {
    // simple filter by status or date range
    let res = [...this.mockOrders];
    if (filters?.status && filters.status !== 'all') res = res.filter(r => r.status === filters.status);
    if (filters?.from || filters?.to) {
      const from = filters.from ? new Date(filters.from) : new Date('1970-01-01');
      const to = filters.to ? new Date(filters.to) : new Date();
      res = res.filter(r => { const d = new Date(r.date); return d >= from && d <= to; });
    }
    return of(res);
  }

  getOrderById(orderId: number): Observable<OrderRecord | undefined> {
    return of(this.mockOrders.find(o => o.orderId === orderId));
  }

  trackOrder(orderId: number): Observable<{ orderId: number; status: string; timeline: { step: string; time?: string }[] }> {
    const o = this.mockOrders.find(x => x.orderId === orderId);
    const base = [
      { step: 'Order Placed', time: o?.date },
      { step: 'Accepted', time: o?.status !== 'placed' ? o?.date : undefined },
      { step: 'Grinding Started', time: o?.status === 'grinding' || o?.status === 'ready' ? o?.date : undefined },
      { step: 'Ready', time: o?.status === 'ready' ? o?.date : undefined },
      { step: 'Out for Delivery', time: o?.status === 'out' ? o?.date : undefined },
      { step: 'Delivered', time: o?.status === 'delivered' ? o?.date : undefined }
    ];
    return of({ orderId, status: o?.status || 'unknown', timeline: base });
  }

  cancelOrder(orderId: number, reason?: string): Observable<{ success: boolean }> {
    const idx = this.mockOrders.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
      this.mockOrders[idx].status = 'cancelled';
      return of({ success: true });
    }
    return of({ success: false });
  }

  reorder(orderId: number): Observable<{ success: boolean; newOrderId?: number }> {
    const o = this.mockOrders.find(x => x.orderId === orderId);
    if (!o) return of({ success: false });
    const copy = { ...o, orderId: Math.floor(10000 + Math.random() * 90000), date: new Date().toISOString(), status: 'placed' };
    this.mockOrders.unshift(copy);
    return of({ success: true, newOrderId: copy.orderId });
  }

}
