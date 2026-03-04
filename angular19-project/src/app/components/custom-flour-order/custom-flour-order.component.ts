import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrainService } from '../../services/grain.service';
import { CustomOrderService } from '../../services/custom-order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-flour-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="cfo-container">
    <h2>Custom Flour Order</h2>

    <section class="step">
      <h3>1. Select Main Grain</h3>
      <div class="grid">
        <div *ngFor="let g of grains" class="card" [class.selected]="selectedMainGrain?.id===g.id">
          <img *ngIf="g.image" [src]="g.image" alt="{{g.name}}"/>
          <div class="info">
            <div class="title">{{g.name}} <small class="local">{{g.localName}}</small></div>
            <div class="price">₹{{g.price}}/kg</div>
            <div class="meta">Stock: {{g.stock || '—'}} • {{g.seasonal ? 'Seasonal' : 'Available'}}</div>
            <button (click)="selectMain(g)">Choose</button>
          </div>
        </div>
      </div>
    </section>

    <section *ngIf="selectedMainGrain" class="step">
      <h3>2. Choose Weight (Main Grain)</h3>
      <div class="weight-row">
        <div class="presets">
          <button *ngFor="let p of [1,2,5,10]" (click)="setMainWeight(p)">{{p}} kg</button>
        </div>
        <div class="controls">
          <button (click)="changeMainWeight(-0.5)">-</button>
          <input type="number" step="0.5" [(ngModel)]="mainWeight" (ngModelChange)="onMainWeightChange($event)" min="1" max="15" />
          <button (click)="changeMainWeight(0.5)">+</button>
        </div>
        <div class="slider">
          <input type="range" min="1" max="15" step="0.5" [(ngModel)]="mainWeight" (ngModelChange)="onMainWeightChange($event)" />
        </div>
      </div>
      <div class="calc">Main: ₹{{selectedMainGrain.price}} × {{mainWeight}} kg = ₹{{mainTotal | number:'1.0-0'}}</div>
    </section>

    <section *ngIf="selectedMainGrain" class="step">
      <h3>3. Protein Additive (optional)</h3>
      <div *ngFor="let p of proteinGrains" class="protein-row">
        <label>
          <input type="checkbox" [(ngModel)]="p._selected" (change)="onProteinToggle(p)" />
          {{p.name}} — ₹{{p.price}}/kg
        </label>
        <div *ngIf="p._selected" class="protein-controls">
          <div>Recommended: {{recommendProtein(p)}} kg</div>
          <div class="prot-input">
            <button (click)="changeProteinWeight(p, -0.25)">-</button>
            <input type="number" step="0.25" [(ngModel)]="p._weight" (ngModelChange)="onProteinWeightChange(p)" />
            <button (click)="changeProteinWeight(p, 0.25)">+</button>
          </div>
          <div class="warning" *ngIf="p._weight > maxProteinForMain()">Max allowed: {{maxProteinForMain()}} kg</div>
        </div>
      </div>
    </section>

    <section *ngIf="selectedMainGrain" class="step">
      <h3>4. Grinding Size</h3>
      <div class="grinds">
        <label *ngFor="let o of grindingOptions" class="grind">
          <input type="radio" name="grind" [(ngModel)]="grind" [value]="o.id" />
          <div class="ginfo">
            <div class="gname">{{o.name}}</div>
            <div class="gdesc">{{o.description}}</div>
          </div>
        </label>
      </div>
    </section>

    <section *ngIf="selectedMainGrain" class="step">
      <h3>5. Packaging & Instructions</h3>
      <div class="pack">
        <label><input type="radio" name="pack" [(ngModel)]="packaging" value="standard" /> Standard</label>
        <label><input type="radio" name="pack" [(ngModel)]="packaging" value="eco" /> Eco-friendly (+₹10)</label>
        <label><input type="radio" name="pack" [(ngModel)]="packaging" value="vacuum" /> Vacuum (+₹20)</label>
      </div>
      <div>
        <textarea [(ngModel)]="instructions" maxlength="500" placeholder="E.g., Make it extra fine, Pack separately"></textarea>
      </div>
    </section>

    <section *ngIf="selectedMainGrain" class="step summary">
      <h3>Order Summary</h3>
      <div class="line">Main: {{selectedMainGrain.name}} — ₹{{selectedMainGrain.price}}/kg × {{mainWeight}} kg = ₹{{mainTotal | number:'1.0-0'}}</div>
      <div *ngIf="selectedProteins.length">
        <div *ngFor="let p of selectedProteins">+ {{p.name}}: ₹{{p.price}}/kg × {{p._weight}} kg = ₹{{(p.price * p._weight) | number:'1.0-0'}}</div>
      </div>
      <div class="line">Subtotal: ₹{{subtotal | number:'1.0-0'}}</div>
      <div class="line">Packaging: ₹{{packCharge}}</div>
      <div class="line">Delivery: ₹{{deliveryCharge}}</div>
      <div class="line">Tax (5%): ₹{{tax | number:'1.0-0'}}</div>
      <div class="total">Total: ₹{{total | number:'1.0-0'}}</div>

      <div class="actions">
        <button (click)="placeOrder()" [disabled]="!canPlace()">Place Order</button>
      </div>
    </section>
  </div>
  `,
  styles: [
    `
    .cfo-container{Padding:16px}
    .grid{display:flex;flex-wrap:wrap;gap:12px}
    .card{border:1px solid #ddd;padding:8px;width:200px;border-radius:6px}
    .card.selected{box-shadow:0 0 0 3px rgba(0,120,212,0.12)}
    .card img{width:100%;height:100px;object-fit:cover}
    .info{padding:6px}
    .title{font-weight:600}
    .local{font-size:12px;color:#666}
    .price{color:#b12704;font-weight:700}
    .weight-row{display:grid;grid-template-columns:1fr 240px 1fr;gap:12px;align-items:center}
    .presets button{margin-right:6px}
    .protein-row{border-bottom:1px dashed #eee;padding:8px}
    .prot-input input{width:80px;text-align:center}
    .grinds{display:flex;gap:12px}
    .grind{border:1px solid #eee;padding:8px;border-radius:6px}
    .summary .line{margin:6px 0}
    .total{font-size:18px;font-weight:700;margin-top:8px}
    .actions{margin-top:12px}
    `
  ]
})
export class CustomFlourOrderComponent implements OnInit {
  private grainService = inject(GrainService);
  private orderService = inject(CustomOrderService);
  private auth = inject(AuthService);
  private router = inject(Router);

  grains: any[] = [];
  proteinGrains: any[] = [];
  grindingOptions: any[] = [];

  selectedMainGrain: any = null;
  mainWeight = 1;
  grind: any = null;
  packaging: string = 'standard';
  instructions = '';

  deliveryCharge = 30;

  ngOnInit(): void {
    this.grainService.listGrains().subscribe(r => this.grains = r || []);
    this.grainService.listProteinGrains().subscribe(r => this.proteinGrains = (r || []).map(x => ({ ...x, _selected: false, _weight: this.defaultProteinWeight() })) );
    this.grainService.listGrindingOptions().subscribe(r => this.grindingOptions = r || []);
  }

  selectMain(g: any) {
    this.selectedMainGrain = g;
    this.mainWeight = Math.max(1, Math.min(15, this.mainWeight));
    this.proteinGrains.forEach(p => p._weight = this.recommendedRatioFor(p) * this.mainWeight);
  }

  setMainWeight(v: number) { this.mainWeight = v; this.onMainWeightChange(v); }
  changeMainWeight(delta: number) { this.mainWeight = Math.round((this.mainWeight + delta) * 2) / 2; this.onMainWeightChange(this.mainWeight); }
  onMainWeightChange(v: any) {
    this.mainWeight = Number(v) || 1;
    if (this.mainWeight < 1) this.mainWeight = 1;
    if (this.mainWeight > 15) this.mainWeight = 15;
    this.proteinGrains.forEach(p => {
      if (!p._selected) return;
      const rec = this.recommendedRatioFor(p) * this.mainWeight;
      if (p._weight > this.maxProteinForMain()) p._weight = this.maxProteinForMain();
      if (!p._weight) p._weight = rec;
    });
  }

  defaultProteinWeight() { return 0.1 * this.mainWeight; }
  recommendedRatioFor(p: any) { return p.recommendedRatio || 0.1; }
  recommendProtein(p: any) { return (this.recommendedRatioFor(p) * this.mainWeight).toFixed(2); }
  maxProteinForMain() { return +(0.2 * this.mainWeight).toFixed(2); }

  onProteinToggle(p: any) {
    if (p._selected && !p._weight) p._weight = this.recommendedRatioFor(p) * this.mainWeight;
  }

  changeProteinWeight(p: any, delta: number) {
    p._weight = Math.round(( (p._weight || 0) + delta) * 100) / 100;
    if (p._weight < 0) p._weight = 0;
    if (p._weight > this.maxProteinForMain()) p._weight = this.maxProteinForMain();
  }

  onProteinWeightChange(p: any) {
    if (p._weight > this.maxProteinForMain()) p._weight = this.maxProteinForMain();
  }

  get mainTotal() { return Math.round((this.selectedMainGrain?.price || 0) * this.mainWeight); }
  get selectedProteins() { return this.proteinGrains.filter(p => p._selected); }
  get proteinTotal() { return this.selectedProteins.reduce((s, p) => s + ((p.price || 0) * (p._weight || 0)), 0); }
  get subtotal() { return this.mainTotal + Math.round(this.proteinTotal); }
  get packCharge() { return this.packaging === 'eco' ? 10 : (this.packaging === 'vacuum' ? 20 : 0); }
  get tax() { return Math.round(0.05 * (this.subtotal + this.packCharge + this.deliveryCharge)); }
  get total() { return this.subtotal + this.packCharge + this.deliveryCharge + this.tax; }

  canPlace() {
    return !!this.selectedMainGrain && this.mainWeight >=1 && this.mainWeight <=15 && !!this.grind;
  }

  placeOrder() {
    if (!this.canPlace()) return;
    const user = this.auth.getCurrentUser ? this.auth.getCurrentUser() : { id: 1 };
    const payload: any = {
      userId: user?.id || 1,
      adminId: 1,
      mainGrain: { id: this.selectedMainGrain.id, name: this.selectedMainGrain.name, weight: this.mainWeight, price: this.selectedMainGrain.price, total: this.mainTotal },
      proteinGrain: this.selectedProteins.length ? { items: this.selectedProteins.map((p: any) => ({ id: p.id, name: p.name, weight: p._weight, price: p.price, total: Math.round(p.price * p._weight) })) } : null,
      grindingSize: this.grind,
      packaging: this.packaging,
      instructions: this.instructions,
      subtotal: this.subtotal,
      deliveryCharge: this.deliveryCharge,
      tax: this.tax,
      total: this.total,
      status: 'pending',
      orderDate: new Date().toISOString()
    };

    this.orderService.placeOrder(payload).subscribe(res => {
      const id = (res && (res.id || res.orderId)) || null;
      if (id) this.router.navigate(['/user/order/status', id]);
      else this.router.navigate(['/user/orders']);
    }, err => {
      console.error('Order failed', err);
    });
  }
}
