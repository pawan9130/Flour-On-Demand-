import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-delivery-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delivery-settings.component.html'
})
export class DeliverySettingsComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private shopService: ShopService) {
    this.form = this.fb.group({
      shopPickup: [true],
      homeDelivery: [true],
      deliveryRadiusKm: [10],
      freeAboveAmount: [500],
      perKmCharge: [5],
      fixedFee: [20],
      slotBookingEnabled: [false],
      slotDurationMinutes: [30],
      maxOrdersPerSlot: [5],
      minOrderValue: [50],
      maxOrderValue: [5000],
      preparationTimeMinutes: [30],
      autoAccept: [true],
      cutOffTimeMinutes: [120]
    });
  }

  ngOnInit(): void {
    this.shopService.getShopProfile().subscribe(p => {
      if (p.deliverySettings) {
        this.form.patchValue(p.deliverySettings as any);
      }
    });
  }

  save() {
    this.shopService.updateDeliverySettings(this.form.value).subscribe(() => alert('Delivery settings saved'));
  }
}
