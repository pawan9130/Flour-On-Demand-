import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ShopService } from '../shop.service';
import { ShopProfile } from '../../../../models/shop.model';

@Component({
  selector: 'app-shop-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './shop-profile.component.html',
  styleUrls: ['./shop-profile.component.css']
})
export class ShopProfileComponent implements OnInit {
  form!: FormGroup;

  profile?: ShopProfile;
  gallery: string[] = [];
  coverPreview: string | null = null;
  logoPreview: string | null = null;

  constructor(private fb: FormBuilder, private shopService: ShopService) {}

  ngOnInit(): void {
    // initialize form after FormBuilder is available
    this.form = this.fb.group({
      name: [''],
      ownerName: [''],
      contactNumber: [''],
      altNumber: [''],
      email: [''],
      gstNumber: [''],
      fssaiNumber: [''],
      description: [''],
      isOpen: [true],
      verified: [false],
      address: this.fb.group({
        line1: [''],
        line2: [''],
        landmark: [''],
        city: [''],
        state: [''],
        pincode: [''],
        latitude: [null],
        longitude: [null]
      })
    });

    this.shopService.getShopProfile().subscribe(p => {
      this.profile = p;
      this.gallery = p.gallery || [];
      this.coverPreview = p.coverImage || null;
      this.logoPreview = p.logo || null;
      // cast to any to satisfy strict shape differences
      this.form.patchValue(p as any);
    });
  }

  saveProfile() {
    const data = this.form.value;
    this.shopService.updateShopProfile(data).subscribe(p => {
      this.profile = p;
      alert('Profile saved');
    });
  }

  onFile(file: File | null, type: 'cover' | 'logo' | 'gallery') {
    if (!file) return;
    this.shopService.uploadShopImage(file, type).subscribe(res => {
      if (type === 'cover') {
        this.coverPreview = res.url;
        this.shopService.updateShopProfile({ coverImage: res.url }).subscribe();
      } else if (type === 'logo') {
        this.logoPreview = res.url;
        this.shopService.updateShopProfile({ logo: res.url }).subscribe();
      } else if (type === 'gallery') {
        this.gallery.push(res.url);
        this.shopService.updateShopProfile({ gallery: this.gallery }).subscribe();
      }
    });
  }

  onGalleryFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach(f => this.onFile(f, 'gallery'));
  }

  pickOnMap() {
    // simple flow: user can open Google Maps and paste coords; we provide fields below
    alert('Use the latitude/longitude fields to set location, or open Maps externally.');
  }

  get v() { return this.form.value as any; }
}
