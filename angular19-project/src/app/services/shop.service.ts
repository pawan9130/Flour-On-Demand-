import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface Shop {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  distanceKm: number;
  isOpen: boolean;
  minOrder: number;
  address?: string;
  coverImage?: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  availableQty: number;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  private api = inject(ApiService);

  // Fallback demo data for offline mode
  private fallbackShops: Shop[] = [
    { id: 1, name: 'Maa Flour Store', rating: 4.6, reviews: 120, distanceKm: 1.2, isOpen: true, minOrder: 100, address: 'MG Road, Demo City', coverImage: '', logo: '' },
    { id: 2, name: 'Govind Grains', rating: 4.2, reviews: 80, distanceKm: 2.1, isOpen: false, minOrder: 150, address: 'Sector 7', coverImage: '', logo: '' },
    { id: 3, name: 'Organic Mills', rating: 3.9, reviews: 45, distanceKm: 4.5, isOpen: true, minOrder: 80, address: 'Green Park', coverImage: '', logo: '' }
  ];

  getShops(filters?: any): Observable<Shop[]> {
    // Try to load from API /shops, fallback to local mock
    return this.api.get<Shop[]>('shops').pipe(
      catchError(() => of(this.fallbackShops))
    );
  }

  getShopById(id: number): Observable<Shop | undefined> {
    return this.api.get<Shop>('shops', id).pipe(catchError(() => of(this.fallbackShops.find(s => s.id === id))));
  }

  // products are still mock for demo; could be wired to /products?adminId=... later
  getShopProducts(shopId: number, _tabType?: string): Observable<Product[]> {
    const demo: { [shopId: number]: Product[] } = {
      1: [ { id: 'p1', name: 'Premium Wheat', price: 180, availableQty: 50 }, { id: 'p2', name: 'Sattu Mix', price: 90, availableQty: 20 } ],
      2: [ { id: 'p3', name: 'Millet Flour', price: 120, availableQty: 30 } ],
      3: [ { id: 'p4', name: 'Ragi Flour', price: 150, availableQty: 10 } ]
    };
    return of(demo[shopId] || []);
  }
}
