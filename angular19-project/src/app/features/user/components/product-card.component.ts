import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="product-card"><h4>{{product.name}}</h4><div class="price">₹{{product.price}}</div><button (click)="add()">Add</button></div>`,
  styles: [` .product-card{background:#fff;padding:12px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.05);display:flex;flex-direction:column;gap:8px} .price{font-weight:600}`]
})
export class ProductCardComponent { @Input() product: any; add(){ /* placeholder */ } }
