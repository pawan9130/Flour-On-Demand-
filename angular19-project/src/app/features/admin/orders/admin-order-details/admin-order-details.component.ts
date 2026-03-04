import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-order-details.component.html',
  styleUrls: ['./admin-order-details.component.scss']
})
export class AdminOrderDetailsComponent implements OnInit {
  order: any;
  constructor(private route: ActivatedRoute, private svc: AdminOrderService) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const numId = Number(id);
    this.svc.getOrderDetails(numId).subscribe(o => {
      this.order = o;
      if (this.order?.createdAt) this.order._createdAtFormatted = formatDate(this.order.createdAt, 'medium', 'en-US');
    });
  }

  updateStatus(status: string) {
    if (!this.order?.id && !this.order?.orderId) return;
    const id = this.order.id || this.order.orderId;
    this.svc.updateOrderStatus(id, status).subscribe(updated => {
      this.order.status = status;
      this.order.updatedAt = updated?.updatedAt || new Date().toISOString();
      this.order._updatedAtFormatted = formatDate(this.order.updatedAt, 'medium', 'en-US');
    });
  }
}
