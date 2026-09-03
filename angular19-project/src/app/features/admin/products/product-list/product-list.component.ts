import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from './../../services/product.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  activeTab: 'readymade' | 'bulk' = 'bulk';
  q = '';

  constructor(private svc: ProductService, private router: Router, private auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  get isBulkTab(): boolean { return this.activeTab === 'bulk'; }

  get tabTitle(): string {
    return this.isBulkTab ? 'Bulk Products' : 'Ready-Made Products';
  }

  get tabDescription(): string {
    return this.isBulkTab
      ? 'Manage all your bulk products and package options.'
      : 'Manage products that are ready for customers to order.';
  }

  load() {
    const current = this.auth.getCurrentUser() || this.getStoredUser();
    const rawAdminId = current?.id ?? current?.userId ?? current?.adminId ?? current?.admin_id;
    const adminId = rawAdminId == null ? null : String(rawAdminId).trim();

    this.products = [];

    this.svc.getProducts().subscribe((allProducts) => {
      const normalized = (allProducts || []).filter((product: any) => {
        const ownerId = String(product.adminId ?? product.shopOwnerId ?? product.ownerId ?? '').trim();
        const matchesAdmin = !adminId || ownerId === adminId;

        const categoryValue = String(product.productType || product.type || product.category || '').trim().toLowerCase();
        const matchesTab = this.activeTab === 'bulk'
          ? categoryValue === 'bulk' || categoryValue === 'bulkorder' || categoryValue === 'bulk-order'
          : categoryValue === 'readymade' || categoryValue === 'readymade' || categoryValue === 'ready-made' || categoryValue === 'ready_made';

        return matchesAdmin && matchesTab;
      });

      this.products = normalized as Product[];
    });
  }

  setTab(tab: 'readymade' | 'bulk') {
    this.activeTab = tab;
    localStorage.setItem('adminProductTab', tab);
    this.load();
  }

  addNew() {
    localStorage.setItem('adminProductTab', this.activeTab);
    this.router.navigate(['/admin/products/add'], { queryParams: { tab: this.activeTab } });
  }

  edit(id: number) { this.router.navigate(['/admin/products/edit', id]); }

  remove(id: number) { if (confirm('Delete product?')) this.svc.deleteProduct(id).subscribe(()=>this.load()); }

  toggleStatus(id: number) { this.svc.toggleProductStatus(id).subscribe(()=>this.load()); }

  getImage(product: Product): string {
    return product.images?.[0] || 'https://placehold.co/120x90/faf7f2/f1b24a?text=No+Image';
  }

  getPackageSummary(product: Product): string {
    if (!product || !product.category) {
      return 'Package';
    }

    if (this.isBulkTab && (product as any).packageSizes) {
      const sizes = (product as any).packageSizes;
      if (typeof sizes === 'object') {
        return Object.keys(sizes).slice(0, 3).join(', ');
      }
      return String(sizes);
    }

    return 'Standard';
  }

  private getStoredUser(): any | null {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  formatStatus(status?: string): string {
    return (status || 'active').toString();
  }
}
