import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService, Shop } from '../../../../services/shop.service';
import { ShopCardComponent } from '../../components/shop-card.component';
import { LoadingSkeletonComponent } from '../../../../shared/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopCardComponent, LoadingSkeletonComponent],
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {
  query = '';
  ratingFilter = 0;
  distanceFilter = 0;
  openNow = false;
  shops: Shop[] = [];
  loading = true;

  constructor(private shopSvc: ShopService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    const filters = { q: this.query, minRating: this.ratingFilter || undefined, maxDistanceKm: this.distanceFilter || undefined, openNow: this.openNow };
    this.shopSvc.getShops(filters).subscribe(s => { this.shops = s; this.loading = false; });
  }

  clearFilters() {
    this.query = '';
    this.ratingFilter = 0;
    this.distanceFilter = 0;
    this.openNow = false;
    this.load();
  }
}
