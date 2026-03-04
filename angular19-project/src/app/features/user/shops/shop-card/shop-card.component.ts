import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Shop } from '../../../../services/shop.service';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-card.component.html',
  styles: [`.shop{background:#fff;padding:12px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,.06)} .meta{color:#666;font-size:.9em}`]
})
export class ShopCardComponent {
  @Input() shop!: Shop;
  constructor(private router: Router) {}
  open() { this.router.navigate([`/user/shop/${this.shop.id}`]); }
}
