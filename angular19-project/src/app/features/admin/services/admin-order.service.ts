import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { WishlistService } from '../../../services/wishlist.service';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  constructor(private api: ApiService, private wishlistService: WishlistService) {}

  getOrders(filters?: any, page = 1): Observable<any[]> {
    // basic: return all orders; json-server supports ?q=
    const params: any = {};
    if (filters?.q) params.q = filters.q;
    return this.api.get<any[]>('orders').pipe(
      tap(list => console.debug('[AdminOrderService] raw orders:', list)),
      switchMap(list => {
        if (!list || list.length === 0) return of([]);
        const calls = list.map(o => {
          const user$ = o.userId ? this.api.get<any>('users', o.userId) : of(null);
          const admin$ = o.adminId ? this.api.get<any>('admins', o.adminId) : of(null);
          return forkJoin({ order: of(o), user: user$, admin: admin$ }).pipe(
            map((res: any) => {
              const out = { ...res.order } as any;
              out.user = res.user;
              out.admin = res.admin;
              // ensure orderId is available for templates (db.json may use `id`)
              out.orderId = out.orderId || out.id;
              out.customer = res.user?.name || res.user?.firstName || res.user?.email || out.customer || 'Customer';
              return out;
            })
          );
        });
        return forkJoin(calls).pipe(
          tap(enriched => console.debug('[AdminOrderService] enriched orders:', enriched)),
          catchError(err => {
            console.error('[AdminOrderService] error enriching orders', err);
            return of([]);
          })
        );
      }),
      catchError(err => {
        console.error('[AdminOrderService] failed to load orders', err);
        return of([]);
      })
    );
  }

  getOrderDetails(orderId: string | number): Observable<any> {
    // fetch order and the associated user profile/address
    return this.api.get<any>('orders', orderId).pipe(
      switchMap(order => {
        if (!order) return of(null);
        const userId = order.userId;
        const adminId = order.adminId;
        const calls: any = { order: of(order) };
        if (userId) calls.user = this.api.get<any>('users', userId);
        if (adminId) calls.admin = this.api.get<any>('admins', adminId);
        return forkJoin(calls).pipe(
          map((res: any) => {
            const out = { ...res.order } as any;
            // ensure orderId available for callers
            out.orderId = out.orderId || out.id;
            if (res.user) out.user = res.user;
            if (res.admin) out.admin = res.admin;
            out.customer = out.customer || res.user?.name || res.user?.firstName || res.user?.email;
            return out;
          })
        );
      })
    );
  }

  updateOrderStatus(orderId:string | number, status:string, notes?:string): Observable<any>{
    const payload: any = {
      status,
      notes,
      updatedAt: new Date().toISOString()
    };

    if (status === 'accepted') {
      payload.acceptedDate = new Date().toISOString();
      payload.rejectedDate = null;
      payload.rejectionReason = '';
    }

    if (status === 'rejected') {
      payload.rejectedDate = new Date().toISOString();
      payload.rejectionReason = notes || 'Rejected by flour owner';
      payload.acceptedDate = null;
    }

    if (status === 'pending') {
      payload.acceptedDate = null;
      payload.rejectedDate = null;
      payload.rejectionReason = '';
    }

    return this.api.patch('orders', orderId, payload);
  }

  acceptOrder(orderId:number): Observable<any> {
    return this.api.get<any>('orders', orderId).pipe(
      switchMap(order => this.updateOrderStatus(orderId, 'accepted').pipe(
        map(updated => {
          if (Array.isArray(order?.items)) {
            order.items.forEach((item: any) => {
              const productId = item.productId || item.id || item.product?.id || item.name;
              if (productId) {
                this.wishlistService.removeByProductId(productId);
              }
            });
          }
          return updated;
        })
      ))
    );
  }

  rejectOrder(orderId:number, reason?:string): Observable<any>{ return this.updateOrderStatus(orderId,'rejected', reason || 'Rejected by flour owner'); }
  cancelOrder(orderId:number, reason?:string): Observable<any>{ return this.updateOrderStatus(orderId,'cancelled', reason || 'Cancelled by flour owner'); }

  getOrderTimeline(orderId:number): Observable<any[]>{ return of([{step:'Placed',time:new Date().toISOString()},{step:'Accepted'}]); }
}
