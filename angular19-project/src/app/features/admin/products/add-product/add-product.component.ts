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
  productId: number | string | null = null;
  isEditMode = false;
  private existingAdminId: any = null;
  private originalCategory: 'bulk' | 'readymade' | 'custom' = 'readymade';
  private originalCategoryId: number | undefined;
  tab: 'readymade' | 'bulk' | 'custom' = 'readymade';
  category: 'bulk' | 'readymade' | 'custom' = 'readymade';
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
    const routeId = this.route.snapshot.paramMap.get('id') || this.route.snapshot.queryParamMap.get('editId');
    this.productId = routeId || null;
    this.isEditMode = !!routeId;

    if (this.productId) {
      this.loadProduct(this.productId);
      return;
    }

    this.route.queryParamMap.subscribe(params => {
      const selectedTab = params.get('tab') || localStorage.getItem('adminProductTab') || 'readymade';
      if (selectedTab === 'custom') {
        this.tab = 'custom';
        this.category = 'custom';
      } else if (selectedTab === 'bulk') {
        this.tab = 'bulk';
        this.category = 'bulk';
      } else {
        this.tab = 'readymade';
        this.category = 'readymade';
      }
      localStorage.setItem('adminProductTab', this.tab);
    });
  }

  private loadProduct(id: number | string) {
    this.svc.getProductById(id).subscribe(product => {
      if (!product) {
        alert('Product not found.');
        this.router.navigate(['/admin/products']);
        return;
      }

      const productType = ProductService.normalizeProductType(String(product.productType || product.category || ''));
      this.tab = productType === 'Bulk' ? 'bulk' : productType === 'CustomFlourProduct' ? 'custom' : 'readymade';
      this.category = this.tab;
      this.originalCategory = this.category;
      this.originalCategoryId = product.categoryId;
      this.existingAdminId = product.adminId;
      this.name = product.name || '';
      this.slug = product.slug || '';
      this.price = Number(product.price || 0);
      this.stock = Number(product.stock || 0);
      this.description = product.description || '';
      this.imageUrl = product.images?.[0] || '';
      this.readyIn = product.readyIn || 'Ready to deliver';
      this.status = product.status === 'inactive' ? 'inactive' : 'active';

      if (product.packageSizes && typeof product.packageSizes === 'object') {
        this.packageSizes = Object.entries(product.packageSizes)
          .map(([size, value]) => `${size}: ${value}`)
          .join(', ');
      }

        const current = this.auth.getCurrentUser() || this.getStoredUser();
        const role = (current?.role || current?.userRole || '').toString().toLowerCase();
        const currentUserId = String(current?.id ?? current?.userId ?? current?.adminId ?? '').trim().toLowerCase();
        const productAdminId = String(product.adminId ?? '').trim().toLowerCase();
        if (!['admin', 'superadmin'].includes(role) || (productAdminId && currentUserId !== productAdminId)) {
          alert('You do not have permission to edit this product.');
          this.router.navigate(['/admin/products']);
        }
    });
  }

  setTab(tab: 'readymade' | 'bulk' | 'custom') {
    this.tab = tab;
    this.category = tab;
    localStorage.setItem('adminProductTab', tab);
  }

  setCategory(category: 'readymade' | 'bulk' | 'custom') {
    this.category = category;
    this.tab = category;
    localStorage.setItem('adminProductTab', category);
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

    const productType = this.category === 'bulk' ? 'Bulk' : this.category === 'custom' ? 'CustomFlourProduct' : 'ReadyMade';

    const productPayload: any = {
      adminId: this.isEditMode ? this.existingAdminId : (adminId ?? null),
      name: this.name,
      slug,
      productType,
      category: this.category,
      categoryId: this.isEditMode && this.category === this.originalCategory && this.originalCategoryId !== undefined
        ? this.originalCategoryId
        : (this.category === 'readymade' ? 3 : this.category === 'bulk' ? 4 : 5),
      price: this.category === 'bulk' ? 0 : this.price,
      stock: this.stock,
      description: this.description || '',
      images: this.imageUrl ? [this.imageUrl] : [],
      status: this.status,
      readyIn: this.readyIn,
      packageSizes: this.category === 'bulk' ? this.parsePackageSizes(this.packageSizes) : undefined
    };

    const request = this.isEditMode && this.productId
      ? this.svc.updateProduct(this.productId, productPayload)
      : this.svc.addProduct(productPayload);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error(`Failed to ${this.isEditMode ? 'update' : 'create'} product`, err);
        alert(`Failed to ${this.isEditMode ? 'update' : 'save'} product`);
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
