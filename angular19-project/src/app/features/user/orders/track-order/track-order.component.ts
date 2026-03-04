import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {
  orderId!: number;
  status = '';
  timeline: any[] = [];

  constructor(private route: ActivatedRoute, private orderSvc: OrderService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) return;
      this.orderId = +id;
      this.orderSvc.trackOrder(this.orderId).subscribe(t => { this.status = t.status; this.timeline = t.timeline || []; });
    });
  }
}
