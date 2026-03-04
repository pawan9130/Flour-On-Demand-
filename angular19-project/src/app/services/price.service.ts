import { Injectable } from '@angular/core';
import { GrainSelection, MultigrainAddon, CustomGrindingModel } from '../models/custom-grinding.model';

@Injectable({ providedIn: 'root' })
export class PriceService {
  constructor() {}

  calculateBasePrice(grains: GrainSelection[]): number {
    return grains.reduce((sum, g) => sum + (g.basePricePerKg * (g.quantityKg || 0)), 0);
  }

  calculateGrindingCharges(totalQtyKg: number, size: string): number {
    // simple slabbed charges per kg depending on size
    const rateMap: Record<string, number> = {
      'very-fine': 8,
      'fine': 6,
      'medium': 4,
      'coarse': 3,
      'very-coarse': 2
    };
    const rate = rateMap[size] ?? 4;
    return totalQtyKg * rate;
  }

  calculateAddonCost(basePrice: number, addons: MultigrainAddon[]): number {
    if (!addons || addons.length === 0) return 0;
    return addons.reduce((sum, a) => {
      if (!a.selectedPercentage) return sum;
      return sum + (basePrice * (a.selectedPercentage / 100));
    }, 0);
  }

  getFinalPrice(model: CustomGrindingModel) {
    const base = this.calculateBasePrice(model.grains);
    const totalQty = model.grains.reduce((s, g) => s + (g.quantityKg || 0), 0);
    const grindCharges = this.calculateGrindingCharges(totalQty, model.grindingSize);
    const addonCost = this.calculateAddonCost(base, model.multigrainAddons);
    const grand = base + grindCharges + addonCost;
    const pricePerKg = totalQty ? +(grand / totalQty).toFixed(2) : 0;
    return { base, grindCharges, addonCost, grand, totalQty, pricePerKg };
  }
}
