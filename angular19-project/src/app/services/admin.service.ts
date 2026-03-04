import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens';

export interface Admin {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  active: boolean;
  role?: 'admin' | 'superadmin';
  shopName?: string;
  area?: string;
}
export interface OrderItem { product: string; quantityKg: number; pricePerKg: number }
export interface Order { id: number; userId: number; adminId: number; status: string; items: OrderItem[]; total: number; createdAt: string; updatedAt: string; notes?: string }

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private apiUrl: string) {}

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/admins`);
  }

  createAdmin(admin: Partial<Admin>): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/admins`, admin);
  }

  updateAdmin(id: number, admin: Partial<Admin>): Observable<Admin> {
    return this.http.patch<Admin>(`${this.apiUrl}/admins/${id}`, admin);
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admins/${id}`);
  }

  getOrdersByAdmin(adminId: number): Observable<Order[]> {
    const params = new HttpParams().set('adminId', adminId);
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { params });
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { params });
  }

  assignAdminToOrder(orderId: number, adminId: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}`, { adminId });
  }
}
