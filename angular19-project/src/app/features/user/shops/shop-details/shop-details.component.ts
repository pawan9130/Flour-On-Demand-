import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ShopService, Product } from '../../../../services/shop.service';
import { ProductCardComponent } from '../../components/product-card.component';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit {
  shopId!: number;
  shop: any;
  activeTab: 'grind' | 'ready' | 'bulk' = 'grind';
  products: Product[] = [];
  sticky = false;

  constructor(private route: ActivatedRoute, private shopSvc: ShopService, private cart: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) return;
      this.shopId = +id;
      this.shopSvc.getShopById(this.shopId).subscribe(s => this.shop = s);
      this.loadProducts();
    });
  }

  setTab(t: 'grind' | 'ready' | 'bulk') { this.activeTab = t; this.loadProducts(); }

  loadProducts() {
    this.shopSvc.getShopProducts(this.shopId, this.activeTab).subscribe(p => this.products = p);
  }

  addToCart(p: Product) { this.cart.add({ ...p, qty: 1, shopId: this.shopId }); }

  @HostListener('window:scroll') onScroll(){ this.sticky = window.scrollY > 120; }
}
