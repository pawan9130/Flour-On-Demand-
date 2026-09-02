import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
  id?: string | number;
  shopId?: number;
  qty?: number;
  price?: number;
  type?: string; // e.g., product, custom-grinding
  name?: string;
  model?: any;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>([]);
  public items$ = this._items.asObservable();
  public cartCount$ = this._items.asObservable().pipe(map(items => items.length));

  addToCart(item: CartItem) {
    const items = [...this._items.value, item];
    this._items.next(items);
  }

  // compatibility helper used earlier in code
  add(item: any) { this.addToCart(item); }

  removeFromCart(indexOrId: number | string) {
    const items = this._items.value.filter((it, i) => (typeof indexOrId === 'number' ? i !== indexOrId : it.id !== indexOrId));
    this._items.next(items);
  }

  updateQuantity(indexOrId: number | string, qty: number) {
    const items = this._items.value.map((it, i) => {
      if ((typeof indexOrId === 'number' && i === indexOrId) || (typeof indexOrId === 'string' && it.id === indexOrId)) {
        return { ...it, qty };
      }
      return it;
    });
    this._items.next(items);
  }

  clearCart() { this._items.next([]); }

  getCartTotal(): number {
    return this._items.value.reduce((sum, it) => sum + ((it.price || 0) * (it.qty || 1)), 0);
  }

  validateCart(minOrder = 0) {
    const total = this.getCartTotal();
    return { valid: total >= minOrder, total };
  }

  // group by shop id
  getCartGroupedByShop() {
    const groups: Record<string, CartItem[]> = {};
    this._items.value.forEach(it => {
      const key = it.shopId ? String(it.shopId) : 'misc';
      groups[key] = groups[key] || [];
      groups[key].push(it);
    });
    return groups;
  }
}
