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
  category: string = 'all';
  q = '';

  constructor(private svc: ProductService, private router: Router, private auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load() {
    const current = this.auth.getCurrentUser();
    const adminId = current?.id;
    if (adminId) {
      this.svc.listAdminProducts(adminId).subscribe(p => this.products = p as Product[]);
    } else {
      this.svc.getProducts(this.category).subscribe(p => this.products = p);
    }
  }

  addNew() { this.router.navigate(['/admin/products/add']); }

  edit(id: number) { this.router.navigate(['/admin/products/edit', id]); }

  remove(id: number) { if (confirm('Delete product?')) this.svc.deleteProduct(id).subscribe(()=>this.load()); }

  toggleStatus(id: number) { this.svc.toggleProductStatus(id).subscribe(()=>this.load()); }
}
