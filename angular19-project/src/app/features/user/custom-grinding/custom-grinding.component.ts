import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GrainSelectorComponent } from './grain-selector/grain-selector.component';
import { GrindingOptionsComponent } from './grinding-options/grinding-options.component';
import { MultigrainAddonComponent } from './multigrain-addon/multigrain-addon.component';
import { CustomGrindingModel, GrainSelection, MultigrainAddon } from '../../../models/custom-grinding.model';
import { PriceService } from '../../../services/price.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-custom-grinding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GrainSelectorComponent, GrindingOptionsComponent, MultigrainAddonComponent],
  templateUrl: './custom-grinding.component.html',
  styleUrls: ['./custom-grinding.component.css']
})
export class CustomGrindingComponent implements OnInit {
  step = 1;
  form: FormGroup;

  availableGrains: GrainSelection[] = [];
  addons: MultigrainAddon[] = [];

  totals: any = {};

  constructor(private fb: FormBuilder, private price: PriceService, private cart: CartService) {
    this.form = this.fb.group({ instructions: [''] });
  }

  get instructionsControl(): FormControl {
    return this.form.get('instructions') as FormControl;
  }

  ngOnInit(): void {
    // seed grains
    this.availableGrains = [
      { grainId: 'wheat', name: 'Wheat', quantityKg: 0, basePricePerKg: 180 },
      { grainId: 'bajra', name: 'Bajra', quantityKg: 0, basePricePerKg: 160 },
      { grainId: 'jowar', name: 'Jowar', quantityKg: 0, basePricePerKg: 170 },
      { grainId: 'rice', name: 'Rice', quantityKg: 0, basePricePerKg: 140 },
      { grainId: 'corn', name: 'Corn', quantityKg: 0, basePricePerKg: 120 },
      { grainId: 'chana', name: 'Chana', quantityKg: 0, basePricePerKg: 200 }
    ];

    this.addons = [
      { addonId: 'chana', name: 'Chana', extraPercent: 5 },
      { addonId: 'soy', name: 'Soybean', extraPercent: 3 },
      { addonId: 'oats', name: 'Oats', extraPercent: 4 },
      { addonId: 'flax', name: 'Flax seeds', extraPercent: 6 }
    ];

    this.recalc();
  }

  onGrainsChange(g: GrainSelection[]) {
    this.availableGrains = g;
    this.recalc();
  }

  onAddonsChange(a: MultigrainAddon[]) {
    this.addons = a;
    this.recalc();
  }

  onGrindingSelect(size: string) {
    this.recalc(size);
  }

  recalc(size?: string) {
    const model: CustomGrindingModel = {
      grains: this.availableGrains.filter(g => (g.quantityKg || 0) > 0),
      grindingSize: size || 'fine',
      multigrainAddons: this.addons,
      instructions: this.form.get('instructions')?.value
    };
    this.totals = this.price.getFinalPrice(model as any);
  }

  next() { if (this.step < 4) this.step++; }
  prev() { if (this.step > 1) this.step--; }

  addToCart() {
    const model: CustomGrindingModel = {
      grains: this.availableGrains.filter(g => (g.quantityKg || 0) > 0),
      grindingSize: this.totals.grindingSize || 'fine',
      multigrainAddons: this.addons,
      instructions: this.form.get('instructions')?.value
    };
    const cartItem = { type: 'custom-grinding', model, priceBreakup: this.totals };
    this.cart.add(cartItem);
    alert('Added to cart');
  }
}
