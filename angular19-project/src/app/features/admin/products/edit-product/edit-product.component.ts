import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  product: any = null;
  isOwner = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private svc: ProductService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) return;
      this.svc.getProductById(+id).subscribe(p => {
        if (p && Array.isArray(p.images)) (p as any).imagesString = p.images.join(',');
        this.product = p;

        const current = this.auth.getCurrentUser() || this.getStoredUser();
        const currentUserId = this.normalizeUserId(current?.id ?? current?.userId ?? current?.adminId ?? '');
        const productAdminId = this.normalizeUserId((p as any)?.adminId ?? '');
        const role = (current?.role || current?.userRole || '').toString().toLowerCase();
        const isAdminRole = role === 'admin' || role === 'superadmin';
        this.isOwner = isAdminRole && (!productAdminId || currentUserId === productAdminId || !productAdminId);

        if (!this.isOwner) {
          alert('You do not have permission to edit this product.');
          this.router.navigate(['/admin/products']);
        }
      });
    });
  }

  private normalizeUserId(value: any): string {
    return String(value ?? '').trim().toLowerCase();
  }

  private getStoredUser(): any | null {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  save() {
    if (this.saving || !this.product || !this.product.id) return;

    const currentUser = this.auth.getCurrentUser() || this.getStoredUser();
    const currentUserId = this.normalizeUserId(currentUser?.id ?? currentUser?.userId ?? currentUser?.adminId ?? '');
    const productAdminId = this.normalizeUserId(this.product.adminId ?? '');
    const role = (currentUser?.role || currentUser?.userRole || '').toString().toLowerCase();
    const isAdminRole = role === 'admin' || role === 'superadmin';

    if (!isAdminRole || (!!currentUserId && !!productAdminId && currentUserId !== productAdminId)) {
      alert('You do not have permission to update this product.');
      return;
    }

    const payload = { ...this.product };
    if (payload.imagesString) {
      payload.images = String(payload.imagesString).split(',').map((s: string) => s.trim()).filter(Boolean);
      delete payload.imagesString;
    }

    if (!payload.productType && payload.category) {
      payload.productType = payload.category === 'bulk' ? 'Bulk' : 'ReadyMade';
    }

    this.saving = true;
    this.svc.updateProduct(this.product.id, payload).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: (err) => {
        this.saving = false;
        console.error('Update failed', err);
        alert('Failed to update product');
      }
    });
  }
}
