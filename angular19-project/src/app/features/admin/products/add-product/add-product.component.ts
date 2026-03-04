import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CustomGrindingFormComponent } from '../custom-grinding/custom-grinding-form.component';
import { ReadymadeFlourFormComponent } from '../readymade-flour/readymade-flour-form.component';
import { BulkOrderFormComponent } from '../bulk-order/bulk-order-form.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomGrindingFormComponent,
    ReadymadeFlourFormComponent,
    BulkOrderFormComponent,
  ],
  templateUrl: './add-product.component.html',
})
export class AddProductComponent {
  tab: 'custom' | 'readymade' | 'bulk' = 'custom';
  name = '';
  price = 0;
  stock = 0;
  category= '';
  description = '';
  slug = '';
  images: string[] = [];
  

  constructor(
    private svc: ProductService,
    private auth: AuthService,
    private router: Router,
  ) {}

  saved() {
    this.router.navigate(['/admin/products']);
  }

  save() {
    const current = this.auth.getCurrentUser();
    const adminId = current?.id;

    const slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const productPayload: any = {
      adminId: adminId || null,
      name: this.name,
      slug : this.slug || null,
      categoryId: this.tab === 'custom' ? 1 : this.tab === 'readymade' ? 3 : 4,
      price: this.price,
      stock: this.stock,
      description: this.description || '' ,
      images: [],
      category: this.tab === 'custom' ? 'custom' : this.tab === 'readymade' ? 'readymade' : 'bulk',
      status: 'active'
    };

    this.svc.addProduct(productPayload).subscribe({
      next: (created) => {
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Failed to create product', err);
        alert('Failed to save product');
      }
    });
  }
}
