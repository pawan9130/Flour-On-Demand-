import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Address { id: number; name: string; phone: string; line1: string; city: string; state: string; pincode: string; type: string; isDefault?: boolean }

@Injectable({ providedIn: 'root' })
export class AddressService {
  private addresses: Address[] = [
    { id: 1, name: 'Asha', phone: '9000000000', line1: '123 Demo St', city: 'Demo City', state: 'State', pincode: '560001', type: 'Home', isDefault: true }
  ];

  getAddresses(): Observable<Address[]> { return of(this.addresses); }
  addAddress(a: Address): Observable<Address> { a.id = Math.floor(1000 + Math.random() * 9000); this.addresses.push(a); return of(a); }
  updateAddress(id: number, a: Partial<Address>): Observable<Address | undefined> { const idx = this.addresses.findIndex(x=>x.id===id); if(idx===-1) return of(undefined); this.addresses[idx] = { ...this.addresses[idx], ...a }; return of(this.addresses[idx]); }
  deleteAddress(id: number): Observable<boolean> { this.addresses = this.addresses.filter(x=>x.id!==id); return of(true); }
  setDefaultAddress(id: number): Observable<boolean> { this.addresses = this.addresses.map(x=>({ ...x, isDefault: x.id===id })); return of(true); }
}
