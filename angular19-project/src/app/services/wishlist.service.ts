import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WishlistItem {
  id: string | number;
  wishlistId?: string | number;
  productId?: string | number;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  stock?: number;
  readyIn?: string;
  adminId?: number;
  adminName?: string;
  quantity?: number;
  productComment?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storageKey = 'myflour_wishlist';
  private readonly itemsSubject = new BehaviorSubject<WishlistItem[]>(this.loadFromStorage());

  readonly items$: Observable<WishlistItem[]> = this.itemsSubject.asObservable();
  readonly count$: Observable<number> = this.items$.pipe(map(items => items.length));

  getItems(): WishlistItem[] {
    return [...this.itemsSubject.value];
  }

  addItem(item: WishlistItem): WishlistItem[] {
    const items = [...this.itemsSubject.value];
    const idKey = String(item.id ?? `${item.productId ?? item.name}-${Date.now()}`);
    const normalizedItem: WishlistItem = {
      ...item,
      id: idKey,
      productId: item.productId ?? item.id,
      quantity: Number(item.quantity || 1),
      productComment: item.productComment || '',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = items.findIndex(i => String(i.id) === idKey || (item.productId && String(i.productId) === String(item.productId)));

    if (existingIndex >= 0) {
      items[existingIndex] = { ...items[existingIndex], ...normalizedItem };
    } else {
      items.push(normalizedItem);
    }

    this.persist(items);
    return items;
  }

  updateItem(id: string | number, changes: Partial<WishlistItem>): WishlistItem[] {
    const items = this.itemsSubject.value.map(item => {
      if (String(item.id) !== String(id)) return item;
      return { ...item, ...changes, updatedAt: new Date().toISOString(), quantity: Number(changes.quantity ?? item.quantity ?? 1), productComment: changes.productComment ?? item.productComment ?? '' };
    });
    this.persist(items);
    return items;
  }

  removeItem(id: string | number): WishlistItem[] {
    const items = this.itemsSubject.value.filter(item => String(item.id) !== String(id));
    this.persist(items);
    return items;
  }

  clear(): void {
    this.persist([]);
  }

  removeByProductId(productId: string | number): WishlistItem[] {
    const items = this.itemsSubject.value.filter(item => String(item.productId ?? item.id) !== String(productId));
    this.persist(items);
    return items;
  }

  private loadFromStorage(): WishlistItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as WishlistItem[] : [];
    } catch {
      return [];
    }
  }

  private persist(items: WishlistItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }
}
