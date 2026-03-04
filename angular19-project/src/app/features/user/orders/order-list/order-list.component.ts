import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../services/orders.service';
import { OrderCardComponent } from '../../../user/components/order-card.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  tab: 'all' | 'active' | 'completed' | 'cancelled' = 'all';
  loading = true;

  constructor(private orderSvc: OrdersService, private router: Router, private auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    const user = this.auth.getCurrentUser();
    if (!user) { this.orders = []; this.loading = false; return; }
    this.orderSvc.byUser(user.id).subscribe(r => {
      const all = r || [];
      if (this.tab === 'all') this.orders = all;
      else if (this.tab === 'active') this.orders = all.filter((o: any) => o.status !== 'completed' && o.status !== 'cancelled');
      else if (this.tab === 'completed') this.orders = all.filter((o: any) => o.status === 'completed' || o.status === 'delivered');
      else if (this.tab === 'cancelled') this.orders = all.filter((o: any) => o.status === 'cancelled');
      this.loading = false;
    });
  }

  setTab(t: any) { this.tab = t; this.load(); }
  open(id: any) { this.router.navigate(['/user/order', id]); }
  track(id: any) { this.router.navigate(['/user/track', id]); }
}
