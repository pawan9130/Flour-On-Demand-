export interface GrainSelection {
  grainId: string;
  name: string;
  quantityKg: number;
  basePricePerKg: number;
}

export interface MultigrainAddon {
  addonId: string;
  name: string;
  extraPercent: number; // e.g., 5 means 5%
  selectedPercentage?: number; // 10,20,50 etc.
}

export interface CustomGrindingModel {
  grains: GrainSelection[];
  grindingSize: string;
  multigrainAddons: MultigrainAddon[];
  instructions?: string;
}
