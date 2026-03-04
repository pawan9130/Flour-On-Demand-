import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../services/order.service';

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

  constructor(private route: ActivatedRoute, private orderSvc: OrderService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) return;
      this.orderId = +id;
      this.orderSvc.getOrderById(this.orderId).subscribe(o => this.order = o);
      this.orderSvc.trackOrder(this.orderId).subscribe(t => this.timeline = t.timeline || []);
    });
  }

  cancel(){ if(this.order && confirm('Cancel order?')) this.orderSvc.cancelOrder(this.order.orderId).subscribe(r=>{ if(r.success) this.order.status='cancelled'; }); }
}
