import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-order-modal',
  imports: [CommonModule],
  template: `
  <div class="overlay">
    <div class="modal">
      <button class="close" (click)="cancel.emit()">×</button>
      <div class="content">
        <div class="left">
          <div class="image" [style.background-image]="'url(' + (product?.images?.[0] || '/assets/placeholder.png') +')'"></div>
        </div>
        <div class="right">
          <h3>{{product?.name}}</h3>
          <div class="price">₹{{product?.price}} / kg</div>
          <div class="qty">
            <button (click)="changeQty(-0.5)">−</button>
            <input type="number" step="0.5" [value]="qty" (input)="onQtyInput($event)" />
            <button (click)="changeQty(0.5)">+</button>
          </div>
          <div class="total">Total: <strong>₹{{(product?.price || 0) * qty | number:'1.2-2'}}</strong></div>

          <div class="actions">
            <button class="secondary" (click)="onAddNew()">Add New</button>
            <button class="primary" (click)="onOrderNow()">Order Now</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:2000}
    .modal{background:#fff;border-radius:12px;width:720px;max-width:95%;padding:16px;position:relative}
    .close{position:absolute;right:10px;top:6px;border:none;background:transparent;font-size:22px}
    .content{display:flex;gap:12px}
    .left{width:40%}
    .image{height:160px;background-size:cover;background-position:center;border-radius:8px}
    .right{flex:1;display:flex;flex-direction:column;gap:8px}
    .price{color:#555}
    .qty{display:flex;align-items:center;gap:8px}
    .qty button{width:36px;height:36px;border-radius:50%;border:none;background:#f0f0f0}
    .qty input{width:80px;padding:6px;border-radius:6px;border:1px solid #ddd}
    .total{margin-top:6px}
    .actions{display:flex;gap:8px;margin-top:12px}
    .primary{background:linear-gradient(45deg,#4CAF50,#45a049);color:#fff;border:none;padding:8px 14px;border-radius:8px}
    .secondary{background:#f5f5f5;border:none;padding:8px 14px;border-radius:8px}
    `
  ]
})
export class OrderModalComponent {
  @Input() product: any | null = null;
  @Input() qty = 1;
  @Output() addNew = new EventEmitter<{ product: any; qty: number }>();
  @Output() orderNow = new EventEmitter<{ product: any; qty: number; total: number }>();
  @Output() cancel = new EventEmitter<void>();

  changeQty(delta: number) {
    this.qty = Math.max(0.5, Math.round((this.qty + delta) * 2) / 2);
  }

  onQtyInput(e: Event) {
    const v = parseFloat((e.target as HTMLInputElement).value || '0') || 0.5;
    this.qty = Math.max(0.5, Math.round(v * 2) / 2);
  }

  onAddNew() { if (this.product) this.addNew.emit({ product: this.product, qty: this.qty }); }

  onOrderNow() {
    if (!this.product) return;
    const total = (this.product?.price || 0) * this.qty;
    this.orderNow.emit({ product: this.product, qty: this.qty, total });
  }
}
