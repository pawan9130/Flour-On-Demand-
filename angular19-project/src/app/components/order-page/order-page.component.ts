import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { OrderService } from '../../services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-page',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
  <div class="order-page" *ngIf="product">
    <button (click)="back()">Back</button>
    <h2>Order {{product.name}}</h2>
    <img *ngIf="product.images?.[0]" [src]="product.images[0]" alt="img" />
    <p>{{product.description}}</p>
    <p>Price: ₹{{product.price}} / {{product.unit || 'kg'}}</p>

    <div>
      <label>Grinding Size</label>
      <select [(ngModel)]="grinding">
        <option *ngFor="let g of grindingOptions" [value]="g.key">{{g.label}}</option>
      </select>
    </div>

    <div>
      <label>Quantity (kg)</label>
      <button (click)="dec()">-</button>
      <span>{{qty}}</span>
      <button (click)="inc()">+</button>
      <div>Available: {{product.stock}}</div>
    </div>

    <div>
      <label>Special instructions</label>
      <input [(ngModel)]="notes" />
    </div>

    <div>
      <button (click)="place()">Place Order</button>
    </div>
  </div>
  <div *ngIf="!product">Loading product...</div>
  `
})
export class OrderPageComponent {
  product: any = null;
  qty = 1;
  notes = '';
  grinding = 'barik';
  grindingOptions = [
    { key: 'barik', label: 'Barik (Fine)' },
    { key: 'medium', label: 'Medium' },
    { key: 'extra', label: 'Extra Medium' },
    { key: 'zada', label: 'Zada (Coarse)' }
  ];
  constructor(private route: ActivatedRoute, private api: ApiService, private orderSvc: OrderService, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('productId')) || 0;
    if (id) this.api.get<any>(`products/${id}`).subscribe(p => this.product = p);
  }
  back(){ history.back(); }
  inc(){ if(!this.product) return; if(this.qty < (this.product.stock||999)) this.qty += 0.5; }
  dec(){ if(this.qty > 0.5) this.qty -= 0.5; }
  place(){
    if(!this.product) return;
    const order = {
      items: [{ productId: this.product.id, name: this.product.name, qty: this.qty, price: this.product.price, shopId: this.product.adminId, shopName: this.product.shopName }],
      address: null,
      grindingSize: this.grinding,
      notes: this.notes
    };
    this.orderSvc.placeOrder(order).subscribe(res => {
      if (res?.success) this.router.navigate(['/user/order/status', res.orderId]);
    });
  }
}
