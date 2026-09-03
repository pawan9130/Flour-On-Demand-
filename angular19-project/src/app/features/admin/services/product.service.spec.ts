import { ProductService } from './product.service';

describe('ProductService', () => {
  it('should normalize product types consistently for UI filtering', () => {
    expect(ProductService.normalizeProductType('bulk')).toBe('Bulk');
    expect(ProductService.normalizeProductType('readymade')).toBe('ReadyMade');
    expect(ProductService.normalizeProductType('ReadyMade')).toBe('ReadyMade');
    expect(ProductService.normalizeProductType('Bulk')).toBe('Bulk');
  });

  it('should return only the selected product type', () => {
    const products = [
      { id: 1, name: 'Wheat Flour', productType: 'Bulk', category: 'bulk' },
      { id: 2, name: 'Besan', productType: 'ReadyMade', category: 'readymade' },
      { id: 3, name: 'Rice Flour', productType: 'Bulk', category: 'bulk' }
    ] as any[];

    expect(ProductService.filterProductsByType(products, 'Bulk')).toEqual([products[0], products[2]]);
    expect(ProductService.filterProductsByType(products, 'ReadyMade')).toEqual([products[1]]);
  });

  it('should also filter products using category when productType is missing', () => {
    const products = [
      { id: 1, name: 'Wheat Flour', category: 'bulk', adminId: '1' },
      { id: 2, name: 'Besan', category: 'readymade', adminId: '1' },
      { id: 3, name: 'Rice Flour', category: 'bulk', adminId: '2' }
    ] as any[];

    expect(ProductService.filterProductsByType(products, 'Bulk')).toEqual([products[0]]);
    expect(ProductService.filterProductsByType(products, 'ReadyMade')).toEqual([products[1]]);
  });
});
