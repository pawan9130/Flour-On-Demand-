import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.scss']
})
export class AdminOrderListComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private svc: AdminOrderService, private router: Router){}

  ngOnInit(): void { this.load(); }
  load(){ this.loading = true; this.svc.getOrders().subscribe(o=>{ this.orders = o; this.loading = false; }); }
  open(o:any){ this.router.navigate(['/admin/order', o.id || o.orderId]); }
}
