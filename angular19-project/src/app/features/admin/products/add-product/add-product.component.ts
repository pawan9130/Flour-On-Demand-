import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  tab: 'readymade' | 'bulk' = 'readymade';
  category: 'bulk' | 'readymade' = 'readymade';
  name = '';
  price = 0;
  stock = 0;
  description = '';
  imageUrl = '';
  readyIn = 'Ready to deliver';
  packageSizes = '1 KG: 70, 5 KG: 300, 10 KG: 550, 25 KG: 1200';
  status: 'active' | 'inactive' = 'active';
  slug = '';

  constructor(
    private svc: ProductService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const selectedTab = params.get('tab') || localStorage.getItem('adminProductTab') || 'readymade';
      if (selectedTab === 'bulk') {
        this.tab = 'bulk';
        this.category = 'bulk';
      } else {
        this.tab = 'readymade';
        this.category = 'readymade';
      }
      localStorage.setItem('adminProductTab', this.tab);
    });
  }

  setTab(tab: 'readymade' | 'bulk') {
    this.tab = tab;
    this.category = tab;
    localStorage.setItem('adminProductTab', tab);
  }

  saved() {
    this.router.navigate(['/admin/products']);
  }

  save() {
    const current = this.auth.getCurrentUser() || this.getStoredUser();
    const adminId = current?.id ?? current?.userId ?? current?.adminId ?? current?.admin_id ?? null;

    const slug = (this.slug || this.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const productType = this.category === 'bulk' ? 'Bulk' : 'ReadyMade';

    const productPayload: any = {
      adminId: adminId ?? null,
      name: this.name,
      slug,
      productType,
      category: this.category,
      categoryId: this.category === 'readymade' ? 3 : 4,
      price: this.category === 'readymade' ? this.price : 0,
      stock: this.stock,
      description: this.description || '',
      images: this.imageUrl ? [this.imageUrl] : [],
      status: this.status,
      readyIn: this.readyIn,
      packageSizes: this.category === 'bulk' ? this.parsePackageSizes(this.packageSizes) : undefined
    };

    this.svc.addProduct(productPayload).subscribe({
      next: () => {
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Failed to create product', err);
        alert('Failed to save product');
      }
    });
  }

  private getStoredUser(): any | null {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private parsePackageSizes(raw: string): Record<string, number> {
    const result: Record<string, number> = {};
    (raw || '').split(',').map(part => part.trim()).filter(Boolean).forEach(part => {
      const [label, price] = part.split(':').map(v => v.trim());
      if (label && price) {
        result[label] = Number(price) || 0;
      }
    });
    return result;
  }
}
