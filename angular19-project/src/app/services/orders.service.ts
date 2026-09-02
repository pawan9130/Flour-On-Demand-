import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens';

export interface OrderItem { product: string; quantityKg: number; pricePerKg: number; name?: string; qty?: number; price?: number }
export interface Order { id?: string | number; userId: number; adminId: number; status: string; items: OrderItem[]; total: number; createdAt: string; updatedAt: string; notes?: string; comment?: string; instructions?: string; customerComment?: string; paymentMethod?: string; deliverySlot?: string; deliveryAddress?: any }

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private apiUrl: string) {}

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  list(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  byUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { params: { userId } as any });
  }

  byAdmin(adminId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { params: { adminId } as any });
  }

  getById(id: string | number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  update(id: string | number, data: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${id}`, data);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${id}`);
  }
}


