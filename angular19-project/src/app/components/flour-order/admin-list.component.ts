import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-list',
  imports: [CommonModule, RouterModule, FormsModule],
  template: ` <div class="admin-list">
    <div class="header-row">
      <div>
        <h2>Flour Sellers</h2>
        <p class="muted">Available vendors near you</p>
      </div>
      <div class="controls">
        <input placeholder="Search sellers or area" [value]="q" (input)="onInput($event)" />
        <select (change)="onSort($event)">
          <option value="">Sort: Recommended</option>
          <option value="rating">Rating (high → low)</option>
          <option value="distance">Distance (near → far)</option>
          <option value="orders">Orders (most)</option>
        </select>
        <label><input type="checkbox" (change)="toggleFilter('open', $event)" /> Open Now</label>
        <label><input type="checkbox" (change)="toggleFilter('verified', $event)" /> Verified</label>
      </div>
    </div>

    <div class="grid">
      <div *ngFor="let a of visibleAdmins" class="seller-card" (click)="open(a)">
        <div class="left">
          <img *ngIf="a.avatarUrl; else logo" [src]="a.avatarUrl" class="logo" />
          <ng-template #logo><div class="logo">👤</div></ng-template>
        </div>
        <div class="center">
          <div class="title">{{a.shopName || a.name}} <span *ngIf="a.verified" class="badge">✔️</span></div>
          <div class="meta">⭐ {{a.rating || 4.2}} • {{a.distance || '2.5km'}} • {{a.area || a.address || ''}}</div>
          <div class="stats">🏷️ {{a.productCount || 10}} products • {{a.orderCount || 1200}} orders</div>
        </div>
        <div class="right">
          <div class="status">{{a.openNow ? 'Open' : 'Closed'}}</div>
          <button class="view-btn" (click)="open(a); $event.stopPropagation()">View Products</button>
        </div>
      </div>
    </div>
  </div>`,
  styles: [
    `
    .header-row{display:flex;justify-content:space-between;align-items:center;gap:12px}
    .controls{display:flex;align-items:center;gap:8px}
    input{padding:8px;border-radius:8px;border:1px solid #ddd}
    select{padding:8px;border-radius:8px;border:1px solid #ddd}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-top:12px}
    .seller-card{background:linear-gradient(145deg,#fff,#f7fbf8);border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;box-shadow:0 8px 20px rgba(0,0,0,0.04);cursor:pointer;transition:transform .18s,box-shadow .18s}
    .seller-card:hover{transform:translateY(-6px);box-shadow:0 18px 40px rgba(0,0,0,0.08)}
    .logo{width:64px;height:64px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;font-size:28px}
    .title{font-weight:700}
    .badge{background:#e6ffed;padding:4px 6px;border-radius:8px;margin-left:8px;font-size:12px}
    .view-btn{background:linear-gradient(45deg,#4CAF50,#45a049);color:#fff;border:none;padding:8px 12px;border-radius:10px}
    .muted{color:#666;margin:0}
    `
  ]
})
export class AdminListComponent {
  admins: any[] = [];
  q = '';
  visibleAdmins: any[] = [];
  sortBy = '';
  filters: any = { open: false, verified: false };
  constructor(private adminSvc: AdminService, private router: Router) {
    this.load();
  }
  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value || '';
    this.q = v;
    this.applyFilters();
  }
  load() {
    this.adminSvc.getAdmins().subscribe(a => { this.admins = a || []; this.applyFilters(); });
  }
  search() {
    this.applyFilters();
  }
  onSort(e: Event) {
    this.sortBy = ((e.target as HTMLSelectElement).value || '');
    this.applyFilters();
  }

  toggleFilter(key: string, e: Event) {
    this.filters[key] = !!(e as any).target?.checked;
    this.applyFilters();
  }

  applyFilters() {
    let list = [...(this.admins || [])];
    const q = (this.q || '').toLowerCase().trim();
    if (q) list = list.filter(x => ((x.shopName || x.name || '').toLowerCase().includes(q)) || ((x.area || '') || '').toLowerCase().includes(q));
    if (this.filters.open) list = list.filter(x => x.openNow);
    if (this.filters.verified) list = list.filter(x => x.verified);
    if (this.sortBy === 'rating') list.sort((a,b)=> (b.rating||0)-(a.rating||0));
    if (this.sortBy === 'orders') list.sort((a,b)=> (b.orderCount||0)-(a.orderCount||0));
    if (this.sortBy === 'distance') list.sort((a,b)=> {
      const pa = parseFloat((a.distance||'0').replace(/[^0-9.]/g,''))||0;
      const pb = parseFloat((b.distance||'0').replace(/[^0-9.]/g,''))||0;
      return pa - pb;
    });
    this.visibleAdmins = list;
  }
  open(a: any) {
    this.router.navigate(['/user/flour-order/admin', a.id]);
  }
}
