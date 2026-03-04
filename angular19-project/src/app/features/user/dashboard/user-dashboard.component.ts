import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderCardComponent } from '../components/order-card.component';
import { ShopCardComponent } from '../components/shop-card.component';
import { ProductCardComponent } from '../components/product-card.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderCardComponent, ShopCardComponent, ProductCardComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  userName = 'Valued Customer';
  recentOrders: any[] = [];
  nearbyShops: any[] = [];
  recommended: any[] = [];

  constructor(private cart: CartService, private router: Router) {}

  ngOnInit(): void {
    this.userName = 'Asha';
    this.recentOrders = [
      { id: 101, title: 'Wheat Flour 5kg', date: '2026-02-10' },
      { id: 102, title: 'Millet Mix 2kg', date: '2026-02-05' },
      { id: 103, title: 'Bulk Order Sample', date: '2026-01-28' }
    ];

    this.nearbyShops = [
      { id: 1, name: 'Maa Flour Store', distance: '1.2 km' },
      { id: 2, name: 'Govind Grains', distance: '2.1 km' }
    ];

    this.recommended = [
      { id: 'p1', name: 'Premium Wheat', price: 180 },
      { id: 'p2', name: 'Sattu Mix', price: 90 }
    ];
  }

  orderNow() { this.cart.add({ id: 'p1', name: 'Premium Wheat', qty: 1 }); }

  trackOrder() { alert('Open orders/track screen'); }

  navigateToTab(path: string) {
    try { this.router.navigate([path]); } catch (e) { console.error('navigate error', e); }
  }
}
