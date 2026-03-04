import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="shop-card"><h4>{{shop.name}}</h4><div class="meta">{{shop.distance}}</div></div>`,
  styles: [` .shop-card{background:#fff;padding:12px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.05);} .meta{color:#666;font-size:.9em}`]
})
export class ShopCardComponent { @Input() shop: any; }
