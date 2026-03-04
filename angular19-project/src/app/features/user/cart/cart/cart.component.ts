import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  items = [] as any[];
  total = 0;

  constructor(private cart: CartService) {
    this.cart.items$.subscribe((i: any) => { this.items = i; this.total = this.cart.getCartTotal(); });
  }

  remove(index: number) { this.cart.removeFromCart(index); }
  increase(index: number) { const it = this.items[index]; this.cart.updateQuantity(index, (it.qty || 1) + 1); }
  decrease(index: number) { const it = this.items[index]; const newQ = Math.max(0, (it.qty || 1) - 1); this.cart.updateQuantity(index, newQ); }
}
