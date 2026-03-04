import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../../services/cart.service';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  step = 1;
  items: any[] = [];
  address: any = null;
  slot: any = null;
  payment = 'cod';

  constructor(private cart: CartService, private order: OrderService, private router: Router) {
    this.cart.items$.subscribe(i => this.items = i);
  }

  next() { if (this.step < 4) this.step++; }
  prev() { if (this.step > 1) this.step--; }

  placeOrder() {
    const data = { items: this.items, address: this.address, slot: this.slot, paymentMethod: this.payment };
    this.order.placeOrder(data).subscribe(res => {
      if (res.success) {
        this.cart.clearCart();
        this.router.navigate(['/user']);
        alert('Order placed: ' + res.orderId);
      }
    });
  }
}
