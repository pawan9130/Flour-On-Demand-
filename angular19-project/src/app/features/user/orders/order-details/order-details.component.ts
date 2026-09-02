import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../../services/orders.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orderId!: number;
  order: any;
  timeline: any[] = [];
  statusSteps = [
    { key: 'pending', label: 'Pending Approval' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'grinding', label: 'Grinding in Progress' },
    { key: 'ready', label: 'Ready' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  constructor(private route: ActivatedRoute, private orderSvc: OrdersService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) return;
      this.orderSvc.getById(id).subscribe(o => {
        this.order = o;
        this.timeline = this.buildTimeline(o);
      });
    });
  }

  cancel() {
    if (!this.order || !confirm('Cancel order?')) return;
    this.orderSvc.update(this.order.id, { status: 'cancelled', updatedAt: new Date().toISOString() }).subscribe(updated => {
      this.order = updated;
      this.timeline = this.buildTimeline(updated);
    });
  }

  isStepDone(stepKey: string): boolean {
    const orderStatus = this.normalizeStatus(this.order?.status);
    if (orderStatus === 'cancelled') return stepKey === 'pending';
    const index = this.statusSteps.findIndex(s => s.key === stepKey);
    const current = this.statusSteps.findIndex(s => s.key === orderStatus);
    return index <= current;
  }

  private buildTimeline(order: any): any[] {
    return this.statusSteps.map(step => ({
      ...step,
      time: this.isStepDoneForStatus(step.key, order?.status) ? (order?.updatedAt || order?.createdAt) : ''
    }));
  }

  private isStepDoneForStatus(stepKey: string, status: string): boolean {
    const normalized = this.normalizeStatus(status);
    const index = this.statusSteps.findIndex(s => s.key === stepKey);
    const current = this.statusSteps.findIndex(s => s.key === normalized);
    return normalized !== 'cancelled' && index <= current;
  }

  private normalizeStatus(status: string): string {
    const value = (status || 'pending').toLowerCase();
    if (value === 'placed') return 'pending';
    if (value === 'processing' || value === 'grinding_in_progress') return 'grinding';
    if (value === 'out' || value === 'shipped') return 'out_for_delivery';
    if (value === 'confirmed') return 'accepted';
    return value;
  }
}
