import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-summary-modal',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="overlay">
    <div class="modal">
      <button class="close" (click)="cancel()">×</button>
      <div class="content">
        <h3>Order Summary</h3>
        <div class="items">
          <div *ngFor="let it of items; let i = index" class="item-row">
            <div style="display:flex;gap:8px;align-items:center;">
              <div class="iname">{{it.product.name}}</div>
              <div class="controls"><button (click)="onEdit(i)">Edit</button> <button (click)="onDelete(i)">Delete</button></div>
            </div>
            <div class="iqty">{{it.qty}} kg</div>
            <div class="iprice">₹{{(it.product.price * it.qty) | number:'1.2-2'}}</div>
          </div>
        </div>
        <div class="total">Total: <strong>₹{{total | number:'1.2-2'}}</strong></div>

        <div class="shop">Shop: <strong>{{admin?.shopName || admin?.name}}</strong><br/>Owner: {{admin?.name}} • {{admin?.email}}</div>

        <div class="address">Delivery Address:<br/>
          <div *ngIf="user?.address; else noaddr">{{user.address.streetAddress}}, {{user.address.city}} - {{user.address.zipCode}}</div>
          <ng-template #noaddr><div>No address on file</div></ng-template>
        </div>

        <div class="payment">
          <label>Payment Mode:</label>
          <select [(ngModel)]="paymentMode">
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
          </select>
        </div>

        <div class="actions">
          <button class="secondary" (click)="cancel()">Cancel</button>
          <button class="primary" (click)="placeOrder()">Place Order</button>
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
    .items{margin-top:8px}
    .item-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0}
    .total{margin-top:8px;font-size:16px}
    .shop,.address{margin-top:8px;color:#444}
    .payment{margin-top:8px}
    .actions{display:flex;gap:8px;margin-top:12px}
    .primary{background:linear-gradient(45deg,#4CAF50,#45a049);color:#fff;border:none;padding:8px 14px;border-radius:8px}
    .secondary{background:#f5f5f5;border:none;padding:8px 14px;border-radius:8px}
    `
  ]
})
export class SummaryModalComponent {
  @Input() items: { product: any; qty: number }[] = [];
  @Input() admin: any = null;
  @Input() user: any = null;
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() place = new EventEmitter<{ items: any[]; paymentMode: string }>();
  @Output() editItem = new EventEmitter<number>();
  @Output() deleteItem = new EventEmitter<number>();

  paymentMode = 'COD';

  get total() { return this.items.reduce((s, it) => s + ((it.product.price || 0) * (it.qty || 0)), 0); }

  cancel() { this.cancelEvent.emit(); }

  placeOrder() { this.place.emit({ items: this.items, paymentMode: this.paymentMode }); }

  onEdit(i: number) { this.editItem.emit(i); }
  onDelete(i: number) { this.deleteItem.emit(i); }
}
