import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-card">
      <div class="head"><strong>Order #{{order.id || order.orderId}}</strong> <span class="status">{{order.status || order.orderStatus}}</span></div>
      <div class="meta">{{ order.createdAt || order.date }}</div>
      <div class="items">
        <div *ngFor="let it of order.items" class="it">{{ it.product || it.name }} — {{ it.quantityKg || it.qty }} kg • ₹{{ ((it.pricePerKg || it.price) * (it.quantityKg || it.qty)) | number:'1.2-2' }}</div>
      </div>
      <div class="total">Total: ₹{{ order.total }}</div>
      <div class="actions">
        <button type="button" class="primary" (click)="orderAgain.emit(order)">Order Again</button>
      </div>
    </div>
  `,
  styles: [`
    .order-card{background:#fff;padding:12px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.05);} 
    .meta{color:#666;font-size:.9em}
    .head{display:flex;justify-content:space-between;align-items:center}
    .items{margin-top:8px;color:#333}
    .it{font-size:.95em;padding:4px 0}
    .total{margin-top:8px;font-weight:600}
    .status{font-size:.85em;color:#2d6a4f}
    .actions{margin-top:12px;display:flex;justify-content:flex-end}
    .primary{background:#176b4d;color:#fff;border:none;border-radius:8px;padding:8px 12px;cursor:pointer}
  `]
})
export class OrderCardComponent { @Input() order: any; @Output() orderAgain = new EventEmitter<any>(); }
