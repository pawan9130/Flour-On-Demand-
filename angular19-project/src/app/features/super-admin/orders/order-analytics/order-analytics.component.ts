import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperOrderService } from '../super-order.service';

@Component({
  selector: 'app-order-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-analytics.component.html'
})
export class OrderAnalyticsComponent implements OnInit {
  analytics: any = {};

  constructor(private svc: SuperOrderService) {}

  ngOnInit(): void { this.svc.getOrderAnalytics().subscribe(a => this.analytics = a); }
}
