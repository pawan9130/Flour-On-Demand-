import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShopService } from '../shop.service';
import { BusinessHoursDay } from '../../../../models/shop.model';

@Component({
  selector: 'app-business-hours',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business-hours.component.html'
})
export class BusinessHoursComponent implements OnInit {
  form!: FormGroup;

  get days(): FormArray {
    return this.form.get('days') as FormArray;
  }

  constructor(private fb: FormBuilder, private shopService: ShopService) {
    this.form = this.fb.group({ days: this.fb.array([]) });
  }

  ngOnInit(): void {
    this.shopService.getShopProfile().subscribe(p => {
      const hrs = p.businessHours || [];
      if (hrs.length) {
        this.days.clear();
        hrs.forEach(d => this.addDay(d));
      }
    });
  }

  addDay(d?: BusinessHoursDay) {
    this.days.push(this.fb.group({
      day: [d?.day || ''],
      enabled: [d?.enabled ?? true],
      shifts: [d?.shifts || [{ open: '09:00', close: '18:00' }]]
    }));
  }

  save() {
    const val = this.form.value.days as BusinessHoursDay[];
    this.shopService.updateBusinessHours(val).subscribe(() => alert('Business hours updated'));
  }
}
