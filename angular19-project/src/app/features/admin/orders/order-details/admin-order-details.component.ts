import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateStatusComponent } from '../update-status/update-status.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { NotificationService } from '../../../../services/notification.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule, UpdateStatusComponent],
  templateUrl: './admin-order-details.component.html',
  styleUrls: ['./admin-order-details.component.css']
})
export class AdminOrderDetailsComponent implements OnInit {
  orderId!: string | number;
  order: any;
  constructor(private route: ActivatedRoute, private svc: AdminOrderService, private router: Router, private notifications: NotificationService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) return;
      this.orderId = id; // keep as string if id is non-numeric
      this.loadOrder();
    });
  }

  loadOrder() {
    this.svc.getOrderDetails(this.orderId as any).subscribe(o => {
      this.order = o;
      if (this.order?.createdAt) this.order._createdAtFormatted = formatDate(this.order.createdAt, 'medium', 'en-US');
      if (this.order?.updatedAt) this.order._updatedAtFormatted = formatDate(this.order.updatedAt, 'medium', 'en-US');
    });
  }

  onStatusUpdated(status: string) {
    this.svc.updateOrderStatus(this.order?.orderId, status).subscribe(() => this.loadOrder());
  }

  accept() {
    if (!this.order?.orderId) return;
    this.svc.acceptOrder(this.order.orderId).subscribe(() => {
      this.notifications.pushNotification(
        'Order Accepted',
        `Your order #${this.order.orderId} has been accepted. We will try to deliver it to you as soon as possible.`,
        { userId: this.order.userId, orderId: this.order.orderId }
      );
      alert('Order accepted. The user has been notified.');
      this.router.navigate(['/admin/orders']);
    });
  }

  reject() {
    if (!this.order?.orderId) return;
    const reason = window.prompt('Add rejection reason', 'Sorry, Wheat Flour is currently unavailable.');
    const finalReason = (reason || '').trim() || 'Rejected by flour owner';
    this.svc.rejectOrder(this.order.orderId, finalReason).subscribe(() => {
      this.notifications.pushNotification(
        'Order Rejected',
        `We're sorry, but your order #${this.order.orderId} has been rejected by the flour owner.`,
        { userId: this.order.userId, orderId: this.order.orderId }
      );
      alert('Order rejected and the user has been notified.');
      this.router.navigate(['/admin/orders']);
    });
  }

  cancel() {
    if (!this.order?.orderId) return;
    this.svc.cancelOrder(this.order.orderId, 'admin-cancel').subscribe(() => {
      alert('Order cancelled');
      this.router.navigate(['/admin/orders']);
    });
  }

  printInvoice() { this.svc.getOrderDetails(this.order?.orderId).subscribe(o => console.log('Print', o)); }
}
