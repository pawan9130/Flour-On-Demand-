import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminManagementService } from '../admin-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-admin.component.html'
})
export class AddAdminComponent {
  // single-page form
  model: any = {
    userId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    shopName: '',
    address: ''
  };
  permissions: { orders: boolean; products: boolean; reports: boolean } = { orders: true, products: false, reports: false };
  commission: any = { percent: 10, minimum: 0 };
  docPreview: string | null = null;
  saving = false;

  constructor(private svc: AdminManagementService, private router: Router) {}

  onFile(e: any) {
    const f: File = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { this.docPreview = reader.result as string; };
    reader.readAsDataURL(f);
  }

  cancel() { this.router.navigate(['super-admin','admins']); }

  save() {
    if (!this.model.userId || !this.model.password || !this.model.email || !this.model.name) {
      alert('Please fill user id, password, name and email');
      return;
    }
    this.saving = true;
    // validate uniqueness: check existing admins by query
    this.svc.getAdmins({ q: this.model.email }).subscribe(r => {
      const existsByEmail = (r.items || []).some((a:any) => (a.email || '').toLowerCase() === this.model.email.toLowerCase());
      const existsById = (r.items || []).some((a:any) => String(a.id) === String(this.model.userId) || (a.userId && String(a.userId) === String(this.model.userId)) );
      if (existsByEmail) { this.saving = false; alert('An admin with this email already exists'); return; }
      if (existsById) { this.saving = false; alert('User ID already taken'); return; }

      const payload = {
        id: this.model.userId,
        email: this.model.email,
        password: this.model.password,
        name: this.model.name,
        phone: this.model.phone,
        shopName: this.model.shopName,
        address: this.model.address,
        permissions: this.permissions,
        commission: this.commission,
        status: 'PENDING',
        verified: false
      };

      this.svc.addAdmin(payload as any).subscribe(() => {
        this.saving = false;
        this.router.navigate(['super-admin','admins']);
      }, err => { this.saving = false; alert('Failed to create admin'); });
    }, err => { this.saving = false; alert('Validation failed'); });
  }
}

