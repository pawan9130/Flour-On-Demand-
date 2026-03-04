import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

export interface Product {
  id: number;
  adminId?: number;
  name: string;
  slug?: string;
  categoryId?: number;
  category: string;
  price: number;
  stock: number;
  description?: string;
  images?: string[];
  status: 'active'|'inactive';
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}

  // Base product operations
  getProducts(category?: string, filters?: any): Observable<Product[]> {
    return this.api.get<Product[]>('products').pipe(
      map(list => {
        let res = [...(list || [])];
        if (category && category !== 'all') res = res.filter(p => p.category === category);
        if (filters?.lowStock) res = res.filter(p => p.stock <= (filters.lowStockThreshold || 5));
        return res;
      })
    );
  }

  getProductById(id: number): Observable<Product | undefined> { return this.api.get<Product>('products', id); }

  addProduct(data: Partial<Product>): Observable<Product> { return this.api.post('products', data); }
  updateProduct(id: number, data: Partial<Product>): Observable<Product | undefined> { return this.api.patch('products', id, data); }
  deleteProduct(id: number): Observable<boolean> { return this.api.delete('products', id).pipe(map(()=>true)); }

  toggleProductStatus(id: number) {
    return this.getProductById(id).pipe(
      map(p => ({ p }))
    );
  }

  // Admin-specific pricing (adminProducts)
  // Admin-specific product listing: products table stores adminId
  listAdminProducts(adminId:number) {
    return this.api.get<any[]>('products').pipe(map(list => (list||[]).filter(x=>x.adminId==adminId)));
  }

  getAdminProduct(id:number){ return this.api.get<any>('adminProducts', id); }
  createAdminProduct(entry:any){ return this.api.post('adminProducts', entry); }
  updateAdminProduct(id:number, entry:any){ return this.api.patch('adminProducts', id, entry); }
  deleteAdminProduct(id:number){ return this.api.delete('adminProducts', id); }

  // Compute pro-rata price given price per kg and weight in kg
  computeProRataPrice(adminProduct:any, weightKg:number){ const pricePerKg = adminProduct?.pricePerKg ?? adminProduct?.price ?? 0; return +(pricePerKg * (Number(weightKg) || 0)).toFixed(2); }

  // Helper: get price for an admin/product/weight combination
  getPriceForAdminAndWeight(adminId:number, productId:number, weightKg:number){
    return this.api.get<any[]>('adminProducts').pipe(
      map(list => (list||[]).find(x=>x.adminId==adminId && x.productId==productId)),
      map(entry => ({ entry, price: entry ? this.computeProRataPrice(entry, weightKg) : null }))
    );
  }
}
