import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../../services/cart.service';
import { OrdersService } from '../../../../services/orders.service';
import { AuthService } from '../../../../services/auth.service';

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
  address: any = {
    name: 'Asha Sharma',
    phone: '9000000000',
    line1: '12 Market Street, Bengaluru - 560001'
  };
  slot = '10am-12pm';
  payment = 'cod';
  comment = '';
  placing = false;
  message = '';

  constructor(private cart: CartService, private orders: OrdersService, private auth: AuthService, private router: Router) {
    this.cart.items$.subscribe(i => this.items = i);
  }

  next() { if (this.step < 4) this.step++; }
  prev() { if (this.step > 1) this.step--; }

  placeOrder() {
    if (!this.items.length || this.placing) return;
    const user = this.auth.getCurrentUser();
    const now = new Date().toISOString();
    const normalizedItems = this.items.map((it: any) => {
      const name = it.name || it.product || it.type || it.model?.grains?.map((g: any) => g.name).join(', ') || 'Custom flour order';
      const qty = Number(it.qty || it.quantityKg || it.model?.quantityKg || 1);
      const price = Number(it.price || it.pricePerKg || it.priceBreakup || 0);
      const itemComment = it.model?.comments || it.productComment || it.comment || '';
      const productId = it.productId || it.id || it.model?.id || it.product?.id || '';
      return {
        productId,
        id: productId,
        product: name,
        quantityKg: qty,
        pricePerKg: price,
        comment: itemComment,
        productComment: itemComment,
        name,
        qty,
        price
      };
    });
    const total = normalizedItems.reduce((sum, it) => sum + (Number(it.quantityKg || it.qty || 1) * Number(it.pricePerKg || it.price || 0)), 0);
    const safeComment = (this.comment || '').trim();
    const data = {
      userId: Number(user?.id || 1),
      adminId: Number(this.items[0]?.shopId || this.items[0]?.adminId || 1),
      status: 'pending',
      items: normalizedItems,
      total,
      notes: safeComment ? `payment:${this.payment.toUpperCase()} | ${safeComment}` : `payment:${this.payment.toUpperCase()}`,
      comment: safeComment,
      instructions: safeComment,
      customerComment: safeComment,
      additionalComments: safeComment,
      paymentMethod: this.payment,
      deliverySlot: this.slot,
      deliveryAddress: this.address,
      createdAt: now,
      updatedAt: now
    };
    this.placing = true;
    this.orders.create(data).subscribe({
      next: (res) => {
        this.cart.clearCart();
        window.alert('Order Placed\n\nYour order is in the queue. Please wait until the flour owner accepts your order.');
        this.router.navigate(['/user/orders']);
      },
      error: () => {
        this.message = 'Could not place the order. Please make sure the mock API is running.';
        this.placing = false;
      }
    });
  }
}
