import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

export type ProductType = 'Bulk' | 'ReadyMade';

export interface Product {
  id: number;
  adminId?: number | string;
  name: string;
  slug?: string;
  categoryId?: number;
  category: string;
  productType?: ProductType | string;
  price: number;
  stock: number;
  description?: string;
  images?: string[];
  status: 'active'|'inactive';
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  static normalizeProductType(value?: string | null): ProductType {
    const normalized = (value || '').toString().trim().toLowerCase().replace(/[-_\s]+/g, '');
    if (normalized === 'bulk' || normalized === 'bulkorder') return 'Bulk';
    if (normalized === 'readymade' || normalized === 'readymade' || normalized === 'ready-made' || normalized === 'ready_made') return 'ReadyMade';
    return 'ReadyMade';
  }

  static filterProductsByType(list: Product[], productType: 'Bulk' | 'ReadyMade'): Product[] {
    const type = ProductService.normalizeProductType(productType);
    return (list || []).filter((p: Product) => {
      const productTypeValue = ProductService.normalizeProductType(
        (p as any).productType || (p as any).type || p.category || (p as any).product_category || (p as any).categoryName
      );
      return productTypeValue === type;
    });
  }

  constructor(private api: ApiService) {}

  // Base product operations
  getProducts(category?: string, filters?: any): Observable<Product[]> {
    return this.api.get<Product[]>('products').pipe(
      map(list => {
        let res = [...(list || [])];
        if (category && category !== 'all') {
          const targetType = ProductService.normalizeProductType(category === 'bulk' ? 'Bulk' : category === 'readymade' ? 'ReadyMade' : category);
          res = ProductService.filterProductsByType(res, targetType);
        }
        if (filters?.lowStock) res = res.filter(p => p.stock <= (filters.lowStockThreshold || 5));
        return res;
      })
    );
  }

  getProductById(id: number): Observable<Product | undefined> { return this.api.get<Product>('products', id); }

  addProduct(data: Partial<Product>): Observable<Product> {
    const normalizedProduct = {
      ...data,
      productType: ProductService.normalizeProductType((data as any).productType || data.category || 'ReadyMade'),
      category: (data as any).category || ProductService.normalizeProductType((data as any).productType || 'ReadyMade').toLowerCase()
    };
    return this.api.post('products', normalizedProduct);
  }
  updateProduct(id: number, data: Partial<Product>): Observable<Product | undefined> {
    const normalizedProduct = {
      ...data,
      productType: ProductService.normalizeProductType((data as any).productType || data.category || 'ReadyMade'),
      category: (data as any).category || ProductService.normalizeProductType((data as any).productType || 'ReadyMade').toLowerCase()
    };
    return this.api.patch('products', id, normalizedProduct);
  }
  deleteProduct(id: number): Observable<boolean> { return this.api.delete('products', id).pipe(map(()=>true)); }

  toggleProductStatus(id: number) {
    return this.getProductById(id).pipe(
      map(p => ({ p }))
    );
  }

  // Admin-specific pricing (adminProducts)
  // Admin-specific product listing: products table stores adminId and category, not always productType.
  listAdminProducts(adminId:number, productType?: 'Bulk' | 'ReadyMade') {
    return this.api.get<any[]>('products', undefined, { adminId }).pipe(
      map(list => {
        let res = (list || []).filter(x => String(x.adminId ?? x.shopOwnerId ?? '') === String(adminId));
        if (productType) {
          res = ProductService.filterProductsByType(res as Product[], productType);
        }
        return res;
      })
    );
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
