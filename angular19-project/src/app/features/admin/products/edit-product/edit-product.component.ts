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
  templateUrl: './edit-product.component.html'
})
export class EditProductComponent implements OnInit {
  product: any = null;
  isOwner = false;

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
        // normalize images editing field
        if (p && Array.isArray(p.images)) (p as any).imagesString = p.images.join(',');
        this.product = p;
        const current = this.auth.getCurrentUser();
        this.isOwner = !!(current && p && current.id === p.adminId);
        if (!this.isOwner) {
          // not owner -> redirect back to list
          alert('You are not authorized to edit this product.');
          this.router.navigate(['/admin/products']);
        }
      });
    });
  }

  save() {
    if (!this.product || !this.product.id) return;
    // ensure adminId remains unchanged
    const payload = { ...this.product };
    // convert imagesString back to images array
    if (payload.imagesString) {
      payload.images = String(payload.imagesString).split(',').map((s: string) => s.trim()).filter(Boolean);
      delete payload.imagesString;
    }
    this.svc.updateProduct(this.product.id, payload).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: (err) => { console.error('Update failed', err); alert('Failed to update product'); }
    });
  }
}
