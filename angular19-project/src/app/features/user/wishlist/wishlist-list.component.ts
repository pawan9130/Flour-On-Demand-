import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { WishlistItem, WishlistService } from '../../../services/wishlist.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user-wishlist-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="wishlist-panel">
      <div class="wishlist-header">
        <h3>My Wishlist</h3>
        <span class="wishlist-count" *ngIf="items.length">{{items.length}}</span>
      </div>

      <div *ngIf="items.length === 0" class="empty-state">
        <p>No items in your wishlist yet.</p>
        <a routerLink="/user/browse">Browse products</a>
      </div>

      <div *ngIf="items.length > 0" class="wishlist-grid">
        <article *ngFor="let item of items" class="wishlist-card">
          <div class="wishlist-image" [style.background-image]="'url(' + getImage(item) + ')'" aria-label="Wishlist item image"></div>

          <div class="wishlist-body">
            <div class="wishlist-top">
              <h4>{{ item.name }}</h4>
              <div class="price">₹{{ item.price ?? 0 }} / KG</div>
            </div>

            <div class="qty-controls">
              <span>Quantity</span>
              <div class="qty-box">
                <button type="button" class="qty-btn" (click)="changeQuantity(item, -1)">-</button>
                <strong>{{ item.quantity ?? 1 }} KG</strong>
                <button type="button" class="qty-btn" (click)="changeQuantity(item, 1)">+</button>
              </div>
            </div>

            <div class="wishlist-total">Total Price: ₹{{ getItemTotal(item) }}</div>

            <button class="delete-btn" type="button" (click)="remove(item.id)">Remove</button>
          </div>
        </article>
      </div>

      <div class="wishlist-summary" *ngIf="items.length > 0">
        <div class="summary-row"><span>Subtotal</span><strong>₹{{ getSubtotal() }}</strong></div>
        <div class="summary-row"><span>Delivery</span><strong>₹{{ getDeliveryCharges() }}</strong></div>
        <div class="summary-row grand"><span>Grand Total</span><strong>₹{{ getGrandTotal() }}</strong></div>

        <label class="order-comment-box">
          <span>Additional Comments / Instructions</span>
          <textarea [(ngModel)]="orderComment" rows="3" placeholder="Please deliver all products together after 6 PM."></textarea>
        </label>

        <button class="order-all-btn" type="button" (click)="orderAllWishlist()">Order Now</button>
      </div>
    </section>
  `,
  styles: [`
    .wishlist-panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04); }
    .wishlist-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .wishlist-header h3 { margin: 0; font-size: 1.5rem; }
    .wishlist-count { display: inline-flex; align-items: center; justify-content: center; min-width: 28px; height: 28px; border-radius: 999px; background: #e8f5e9; color: #176b4d; font-weight: 700; }
    .wishlist-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
    .wishlist-card { display: flex; flex-direction: column; border: 1px solid #edf2ec; border-radius: 14px; overflow: hidden; background: #fff; }
    .wishlist-image { height: 180px; background-size: cover; background-position: center; background-repeat: no-repeat; background-color: #f3f4f6; }
    .wishlist-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .wishlist-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .wishlist-top h4 { margin: 0; font-size: 1.1rem; }
    .price { font-size: 1rem; font-weight: 800; color: #176b4d; }
    .qty-controls { display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .qty-box { display:flex; align-items:center; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:999px; padding:4px 8px; }
    .qty-btn { width:28px; height:28px; border:none; border-radius:50%; background:#e8f5e9; color:#176b4d; font-size:1.2rem; font-weight:800; cursor:pointer; }
    .wishlist-total { font-weight:800; color:#1f2937; }
    .delete-btn, .order-all-btn { border: none; border-radius: 10px; padding: 10px 14px; font-weight: 600; cursor: pointer; }
    .delete-btn { background: #fef2f2; color: #b91c1c; }
    .order-all-btn { background: linear-gradient(45deg,#4CAF50,#45a049); color: white; width:100%; }
    .wishlist-summary { margin-top:22px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px; display:flex; flex-direction:column; gap:12px; }
    .summary-row { display:flex; justify-content:space-between; gap:12px; color:#475569; }
    .summary-row.grand { font-size:1.1rem; font-weight:800; color:#111827; }
    .order-comment-box { display:flex; flex-direction:column; gap:8px; color:#334155; }
    .order-comment-box textarea { border:1px solid #dbe3ea; border-radius:8px; padding:8px 10px; font:inherit; min-height:80px; resize:vertical; }
    .empty-state { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 18px 0 8px; color: #64748b; }
    .empty-state a { color: #176b4d; font-weight: 600; }
  `]
})
export class UserWishlistListComponent implements OnInit {
  items: WishlistItem[] = [];
  orderComment = '';

  constructor(private wishlistService: WishlistService, private cart: CartService, private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.wishlistService.items$.subscribe(items => {
      this.items = items;
    });
    this.api.get<any[]>('products').subscribe(products => {
      const activeProductIds = new Set(
        (products || [])
          .filter(product => product.status === undefined || String(product.status).toLowerCase() === 'active')
          .map(product => String(product.id))
      );
      this.wishlistService.removeInactiveProducts(activeProductIds);
    });
  }

  getItemTotal(item: Partial<WishlistItem>): number {
    const unitPrice = Number(item.price ?? 0);
    const qty = Number(item.quantity ?? 1);
    return unitPrice * qty;
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + this.getItemTotal(item), 0);
  }

  getDeliveryCharges(): number {
    return this.items.length ? 40 : 0;
  }

  getDiscount(): number {
    return this.items.length > 2 ? 50 : 0;
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.getDeliveryCharges() - this.getDiscount();
  }

  changeQuantity(item: WishlistItem, delta: number) {
    const nextQty = Math.max(1, Number(item.quantity ?? 1) + delta);
    this.wishlistService.updateItem(item.id, { quantity: nextQty });
  }

  remove(id: string | number) {
    const confirmed = window.confirm('Are you sure you want to remove this product from your wishlist?');
    if (confirmed) {
      this.wishlistService.removeItem(id);
    }
  }

  orderNow(item: WishlistItem) {
    const qty = Math.max(1, Number(item.quantity ?? 1));
    this.cart.addToCart({
      id: item.productId ?? item.id,
      shopId: item.adminId || 1,
      qty,
      price: Number(item.price || 0),
      name: item.name,
      model: { name: item.name, comments: item.productComment || '', image: item.image }
    });
    this.router.navigate(['/user/checkout']);
  }

  orderAllWishlist() {
    if (!this.items.length) return;
    this.items.forEach(item => {
      this.cart.addToCart({
        id: item.productId ?? item.id,
        shopId: item.adminId || 1,
        qty: Math.max(1, Number(item.quantity ?? 1)),
        price: Number(item.price || 0),
        name: item.name,
        model: {
          name: item.name,
          comments: item.productComment || '',
          image: item.image,
          orderComment: this.orderComment || ''
        }
      });
    });
    this.router.navigate(['/user/checkout']);
  }

  getImage(item: WishlistItem): string {
    return item.image || '/assets/placeholder.png';
  }
}
