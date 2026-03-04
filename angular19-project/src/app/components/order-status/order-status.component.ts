import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-status',
  imports: [CommonModule],
  template: `
  <div *ngIf="status">
    <h3>Order {{orderId}} - {{status}}</h3>
    <ul>
      <li *ngFor="let t of timeline">{{t.step}} <span *ngIf="t.time"> - {{t.time}}</span></li>
    </ul>
  </div>
  <div *ngIf="!status">Loading...</div>
  `
})
export class OrderStatusComponent {
  orderId = 0;
  status = '';
  timeline: any[] = [];
  constructor(private route: ActivatedRoute, private orderSvc: OrderService) {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId')) || 0;
    if (this.orderId) this.orderSvc.trackOrder(this.orderId).subscribe(r => { this.status = r.status; this.timeline = r.timeline || []; });
  }
}
