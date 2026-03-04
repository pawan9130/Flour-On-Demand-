import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { OrderModalComponent } from './order-modal.component';
import { SummaryModalComponent } from './summary-modal.component';


@Component({
  standalone: true,
  selector: 'app-admin-products',
  imports: [CommonModule, RouterModule, FormsModule, OrderModalComponent, SummaryModalComponent],
  template: `<div class="admin-products">
    <div class="top">
      <button (click)="back()">← Back to Sellers</button>
      <h2>{{adminName}}</h2>
    </div>

    <div *ngIf="message" class="notify">{{message}}</div>

    <div class="filters-row">
      <div class="tabs">
        <button class="active" disabled="true">All Products</button>
        <button disabled="true"> Popular</button>
        <button disabled="true" >New</button>
      </div>
      <div class="search">
        <input placeholder="Search products" (input)="onSearch($event)" />
      </div>
    </div>

    <div class="products-grid">
      <div *ngFor="let p of products" class="product-card">
        <div class="product-image" [style.background-image]="'url('+ (p.images?.[0]||'/assets/placeholder.png') +')'"></div>
        <div class="pcontent">
          <div class="phead">
            <div>
              <div class="pname">{{p.name}}</div>
              <div class="plocal">{{p.localName || ''}}</div>
            </div>
            <div class="price">₹{{p.price}}/kg</div>
          </div>
          <div class="pmeta">Stock: <strong>{{p.stock || 0}} kg</strong> • Ready in {{p.readyIn || '30 mins'}}</div>
          <div class="badges">
            <span *ngIf="p.bestseller" class="badge">🔥 Bestseller</span>
            <span *ngIf="p.organic" class="badge">🌿 Organic</span>
          </div>

          <div class="actions">
            <div class="quantity-selector">
              <button (click)="changeQty(p,-0.5)">−</button>
              <input type="number" step="0.5" [(ngModel)]="p._qty" />
              <button (click)="changeQty(p,0.5)">+</button>
            </div>
            <button class="order-btn" (click)="addToCart(p)">ORDER NOW</button>
          </div>
        </div>
      </div>
    </div>
    <app-order-modal *ngIf="selectedProduct && !selectedProduct.summary && !selectedProduct.confirmation" [product]="selectedProduct" [qty]="selectedQty" (addNew)="onModalAddNew($event)" (orderNow)="onModalOrderNow($event)" (cancel)="closeModal()"></app-order-modal>

    <app-summary-modal *ngIf="selectedProduct?.summary" [items]="selectedProducts" [admin]="adminDetails" [user]="auth.getCurrentUser()" (cancelEvent)="onSummaryCancel()" (place)="onPlaceOrder($event)" (editItem)="onSummaryEdit($event)" (deleteItem)="onSummaryDelete($event)"></app-summary-modal>

    <div *ngIf="selectedProduct?.confirmation" class="overlay">
      <div class="modal" style="max-width:520px;padding:20px;">
        <h3>Your order has been placed from the {{selectedProduct.adminName}}.</h3>
        <p>Thank you for shopping with us. Our mill owner will contact you soon regarding your order.</p>
        <div style="text-align:right;margin-top:12px"><button (click)="selectedProduct=null">Close</button></div>
      </div>
    </div>
  </div>`,
  styles: [
    `
    .top{display:flex;align-items:center;gap:12px}
    .filters-row{display:flex;justify-content:space-between;align-items:center;margin:12px 0}
    .products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
    .product-card{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);display:flex;flex-direction:column}
    .product-image{height:160px;background-size:cover;background-position:center}
    .pcontent{padding:12px;display:flex;flex-direction:column;gap:8px}
    .phead{display:flex;justify-content:space-between;align-items:center}
    .pname{font-weight:700}
    .badge{background:#fff6e6;padding:4px 8px;border-radius:10px;margin-right:6px;font-size:12px}
    .actions{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
    .quantity-selector{display:inline-flex;align-items:center;background:#f5f5f5;padding:4px;border-radius:999px}
    .quantity-selector button{width:36px;height:36px;border-radius:50%;border:none;background:#fff;color:#333}
    .order-btn{background:linear-gradient(45deg,#4CAF50,#45a049);color:#fff;border:none;padding:8px 14px;border-radius:50px}
    .notify{background:#f0fff4;border:1px solid #d4f2d9;padding:8px;border-radius:8px;margin:8px 0;color:#1b6b2d}
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:2000}
    .modal{background:#fff;border-radius:12px;width:720px;max-width:95%;padding:16px;position:relative}
    `
  ]
})
export class AdminProductsComponent {
  products: any[] = [];
  adminId = 0;
  adminName = '';
  selectedProduct: any = null;
  selectedQty = 1;
  message: string | null = null;
  // accumulated selections when user clicks Add New
  selectedProducts: { product: any; qty: number }[] = [];
  adminDetails: any = null;
  private cart = inject(CartService);
  private apiSvc = inject(ApiService);
  private ordersSvc = inject(OrdersService);
  public auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.adminId = id;
    this.load();
  }
  back(){ history.back(); }
  load(){
    this.apiSvc.get<any[]>('products').subscribe(list => {
      this.products = (list||[]).filter(p => Number(p.adminId) === Number(this.adminId)).map(p => ({ ...p, _qty: 1 }));
    });
    this.apiSvc.get<any>(`admins/${this.adminId}`).subscribe(a=> { this.adminName = a?.shopName || a?.name || 'Seller'; this.adminDetails = a; });
  }

  changeQty(p: any, delta: number) {
    p._qty = Math.max(0.5, Math.round(((p._qty || 0) + delta) * 2) / 2);
  }

  addToCart(p: any) {
    // open modal for final confirmation / quantity selection
    this.selectedProduct = p;
    this.selectedQty = p._qty || 1;
    this.message = null;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  // handle Add New from order modal - accumulate and let user pick more
  onModalAddNew(payload: { product: any; qty: number }) {
    this.selectedProducts.push(payload);
    this.closeModal();
    // show confirmation that product was added
    this.message = 'Your product has been added to the wishlist.';
    setTimeout(()=> this.message = null, 3000);
  }

  // handle Order Now from order modal (single product) or when combined selections exist
  onModalOrderNow(payload: { product: any; qty: number; total: number }) {
    // include any previously selected products
    const all = [...this.selectedProducts];
    all.push({ product: payload.product, qty: payload.qty });

    // show summary modal by assigning a special holder
    // reuse selectedProducts to pass to summary modal
    this.selectedProducts = all;
    // close edit modal
    this.closeModal();
    // show summary by setting a flag - reuse selectedProduct as boolean holder
    this.selectedProduct = { summary: true };
  }

  // cancel summary
  onSummaryCancel() {
    this.selectedProduct = null;
    // keep accumulated selections if user wants to continue
  }

  // handle edit/delete coming from summary modal
  onSummaryEdit(index: number) {
    const entry = this.selectedProducts[index];
    if (!entry) return;
    // remove from selections and re-open modal for editing
    this.selectedProducts.splice(index, 1);
    this.selectedProduct = entry.product;
    this.selectedQty = entry.qty || 1;
  }

  onSummaryDelete(index: number) {
    const entry = this.selectedProducts[index];
    if (!entry) return;
    this.selectedProducts.splice(index, 1);
    this.message = `${entry.product.name} removed from selection.`;
    setTimeout(()=> this.message = null, 3000);
  }

  // place order from summary modal
  onPlaceOrder(ev: { items: { product: any; qty: number }[]; paymentMode: string }) {
    const user = this.auth.getCurrentUser();
    const order = {
      userId: user?.id || 0,
      adminId: this.adminId,
      status: 'pending',
      items: ev.items.map(i => ({ product: i.product.name, quantityKg: i.qty, pricePerKg: i.product.price })),
      total: ev.items.reduce((s, it) => s + ((it.product.price || 0) * (it.qty || 0)), 0),
      notes: `payment:${ev.paymentMode}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any;

    this.ordersSvc.create(order).subscribe(created => {
      // add all to local cart for UI consistency
      ev.items.forEach(i => this.cart.addToCart({ id: i.product.id, shopId: this.adminId, qty: i.qty, price: i.product.price, model: i.product }));

      // show confirmation modal by replacing selectedProduct with confirmation payload
      this.selectedProduct = { confirmation: true, adminName: this.adminDetails?.shopName || this.adminDetails?.name };
      this.selectedProducts = [];
    }, err => {
      this.message = 'Failed to place order. Try again.';
      setTimeout(()=> this.message = null, 4000);
    });
  }

  confirmOrder(ev: { qty: number; total: number }) {
    if (!this.selectedProduct) return;
    const user = this.auth.getCurrentUser();
    const order = {
      userId: user?.id || 0,
      adminId: this.adminId,
      status: 'pending',
      items: [ { product: this.selectedProduct.name, quantityKg: ev.qty, pricePerKg: this.selectedProduct.price } ],
      total: ev.total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any;

    this.ordersSvc.create(order).subscribe(created => {
      // also add to local cart for UI consistency
      const item = { id: this.selectedProduct.id, shopId: this.adminId, qty: ev.qty, price: this.selectedProduct.price, model: this.selectedProduct };
      this.cart.addToCart(item);
      this.message = `Order placed — ₹${ev.total.toFixed(2)}`;
      this.selectedProduct = null;
      // clear message after few seconds
      setTimeout(()=> this.message = null, 4000);
    }, err => {
      this.message = 'Failed to place order. Try again.';
      setTimeout(()=> this.message = null, 4000);
    });
  }

  onSearch(e: Event) {
    const q = ((e.target as HTMLInputElement).value || '').toLowerCase();
    this.apiSvc.get<any[]>('products').subscribe(list => {
      this.products = (list||[]).filter(p => Number(p.adminId) === Number(this.adminId) && (p.name || '').toLowerCase().includes(q)).map(p=> ({ ...p, _qty: p._qty || 1 }));
    });
  }
}
