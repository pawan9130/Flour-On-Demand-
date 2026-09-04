import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';

interface GrainLine { product: any; quantity: number; }

@Component({
  selector: 'app-custom-grinding',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './custom-grinding.component.html',
  styleUrls: ['./custom-grinding.component.css']
})
export class CustomGrindingComponent implements OnInit {
  admins: any[] = [];
  products: any[] = [];
  selectedAdmin: any = null;
  primary: GrainLine = { product: null, quantity: 1 };
  extras: GrainLine[] = [];
  flourSize = 1;
  customSize = 1;
  comments = '';
  loading = true;
  placing = false;
  message = '';

  constructor(private api: ApiService, private orders: OrdersService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.api.get<any[]>('admins').subscribe(admins => {
      this.admins = (admins || []).filter(admin => String(admin.status || 'ACTIVE').toLowerCase() === 'active');
      this.loading = false;
    });
  }

  selectAdmin(admin: any): void {
    this.selectedAdmin = admin;
    this.primary = { product: null, quantity: 1 };
    this.extras = [];
    this.message = '';
    this.api.get<any[]>('products').subscribe(products => {
      this.products = (products || []).filter(product => {
        const type = String(product.productType || product.category || '').toLowerCase().replace(/[-_\s]+/g, '');
        const sameOwner = String(product.adminId ?? product.shopOwnerId ?? '').trim().toLowerCase() === String(admin.id).trim().toLowerCase();
        return sameOwner && (type === 'customflourproduct' || type === 'customflour' || type === 'customgrinding' || type === 'custom') && String(product.status || 'active').toLowerCase() === 'active';
      });
    });
  }

  get selectedLines(): GrainLine[] { return this.primary.product ? [this.primary, ...this.extras] : []; }
  get totalQuantity(): number { return this.selectedLines.reduce((sum, line) => sum + Number(line.quantity || 0), 0); }
  get totalPrice(): number { return this.selectedLines.reduce((sum, line) => sum + Number(line.product.price || 0) * Number(line.quantity || 0), 0); }
  get finalSize(): number { return this.flourSize === -1 ? Number(this.customSize || 0) : this.flourSize; }

  selectPrimary(product: any): void {
    this.primary.product = product;
    this.primary.quantity = Math.max(0.5, Math.min(Number(product.stock || 999), this.finalSize || 1));
    this.extras.forEach(line => line.quantity = this.recommendedQuantity());
  }

  addExtra(): void {
    const product = this.products.find(item => !this.selectedLines.some(line => line.product.id === item.id));
    if (product) this.extras.push({ product, quantity: this.recommendedQuantity() });
  }

  removeExtra(index: number): void { this.extras.splice(index, 1); }
  recommendedQuantity(): number { return Math.max(0.25, Math.round((Number(this.primary.quantity || 1) * 0.05) * 4) / 4); }
  quantityChanged(): void { this.extras.forEach(line => line.quantity = this.recommendedQuantity()); }

  placeOrder(): void {
    if (!this.selectedAdmin || !this.primary.product || this.totalQuantity <= 0 || this.placing) return;
    if (this.finalSize > 0 && this.totalQuantity < this.finalSize) {
      this.message = `Select at least ${this.finalSize} KG of ingredients.`;
      return;
    }
    const user = this.auth.getCurrentUser();
    const now = new Date().toISOString();
    const items = this.selectedLines.map(line => ({
      productId: line.product.id, id: line.product.id, product: line.product.name, name: line.product.name,
      quantityKg: Number(line.quantity), qty: Number(line.quantity), pricePerKg: Number(line.product.price || 0),
      price: Number(line.product.price || 0), productType: 'CustomFlourProduct'
    }));
    const order = {
      userId: user?.id || 0, adminId: this.selectedAdmin.id, status: 'pending', items, total: this.totalPrice,
      notes: this.comments, comment: this.comments, instructions: this.comments, additionalComments: this.comments,
      customFlour: { flourSize: this.finalSize, totalQuantity: this.totalQuantity, adminId: this.selectedAdmin.id },
      createdAt: now, updatedAt: now
    };
    this.placing = true;
    this.orders.create(order).subscribe({
      next: () => { this.placing = false; window.alert('Custom flour order placed successfully.'); this.router.navigate(['/user/orders']); },
      error: () => { this.placing = false; this.message = 'This custom flour is no longer available. Please refresh and try again.'; }
    });
  }
}
