import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  productType?: string;
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  private api = inject(ApiService);

  private fallbackShops: Shop[] = [
    { id: 1, name: 'Maa Flour Store', rating: 4.6, reviews: 120, distanceKm: 1.2, isOpen: true, minOrder: 100, address: 'MG Road, Demo City', coverImage: '', logo: '' },
    { id: 2, name: 'Govind Grains', rating: 4.2, reviews: 80, distanceKm: 2.1, isOpen: false, minOrder: 150, address: 'Sector 7', coverImage: '', logo: '' },
    { id: 3, name: 'Organic Mills', rating: 3.9, reviews: 45, distanceKm: 4.5, isOpen: true, minOrder: 80, address: 'Green Park', coverImage: '', logo: '' }
  ];

  getShops(filters?: any): Observable<Shop[]> {
    return this.api.get<Shop[]>('shops').pipe(
      catchError(() => of(this.fallbackShops))
    );
  }

  getShopById(id: number): Observable<Shop | undefined> {
    return this.api.get<Shop>('shops', id).pipe(catchError(() => of(this.fallbackShops.find(s => s.id === id))));
  }

  getShopProducts(shopId: number, tabType?: string): Observable<Product[]> {
    const typeFilter = tabType === 'bulk' ? 'Bulk' : tabType === 'ready' ? 'ReadyMade' : undefined;

    return this.api.get<any[]>('products', undefined, { adminId: shopId }).pipe(
      map(list => {
        const items = Array.isArray(list) ? list : [];
        return items
          .filter(item => {
            const productType = (item.productType || item.category || '').toString();
            const isActive = item.status === undefined || item.status === 'active' || item.status === 'ACTIVE';
            const isDeleted = item.isDeleted === true || item.deleted === true;
            const matchesOwner = String(item.adminId ?? item.shopOwnerId ?? '') === String(shopId);
            const matchesTab = !typeFilter || productType === typeFilter || (typeFilter === 'ReadyMade' && productType === 'readymade') || (typeFilter === 'Bulk' && productType === 'bulk');
            return matchesOwner && isActive && !isDeleted && matchesTab;
          })
          .map(item => ({
            id: String(item.id),
            name: item.name,
            price: Number(item.price || 0),
            availableQty: Number(item.stock ?? item.availableQty ?? 0),
            image: Array.isArray(item.images) ? item.images[0] : item.image,
            productType: item.productType || item.category || 'ReadyMade'
          }));
      }),
      catchError(() => of([]))
    );
  }
}
