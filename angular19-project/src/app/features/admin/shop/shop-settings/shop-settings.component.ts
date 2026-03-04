import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-shop-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shop-settings.component.html'
})
export class ShopSettingsComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private shopService: ShopService) {
    this.form = this.fb.group({
      acceptCOD: [true],
      onlinePayment: [true],
      upiId: [''],
      bankAccount: [''],
      emailNotifications: [true],
      smsNotifications: [true],
      orderAlertSound: [true],
      lowStockAlert: [true],
      invoiceTemplate: ['default'],
      kitchenReceiptFormat: ['standard'],
      autoPrint: [false]
    });
  }

  ngOnInit(): void {
    this.shopService.getShopProfile().subscribe(p => {
      // populate payment/notification/print defaults if present
    });
  }

  save() {
    // save logic could be merged into shop profile or separate endpoint
    alert('Settings saved (mock)');
  }

  onToggle(key: string, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.form.patchValue({ [key]: checked });
  }

  onInput(key: string, e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.form.patchValue({ [key]: v });
  }

  onSelect(key: string, e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    this.form.patchValue({ [key]: v });
  }
}
