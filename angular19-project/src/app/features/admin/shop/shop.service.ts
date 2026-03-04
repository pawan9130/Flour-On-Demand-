import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { ShopProfile, BusinessHoursDay, DeliverySettings } from '../../../models/shop.model';
import { ApiService } from '../../../services/api.service';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private api = inject(ApiService);
  // shop id to manage (single-shop demo)
  private SHOP_ID = 1;

  getShopProfile(): Observable<ShopProfile> {
    return this.api.get<ShopProfile>('shops', this.SHOP_ID as any);
  }

  updateShopProfile(data: Partial<ShopProfile>): Observable<ShopProfile> {
    return this.api.patch('shops', this.SHOP_ID as any, data);
  }

  uploadShopImage(file: File, type: 'cover' | 'logo' | 'gallery'): Observable<{ url: string; progress?: number }> {
    return new Observable(observer => {
      const fr = new FileReader();
      fr.onload = () => {
        const result = fr.result as string;
        this.api.post('upload-image', { filename: `${Date.now()}_${file.name}`, data: result }).subscribe({
          next: (res: any) => { observer.next({ url: res.url }); observer.complete(); },
          error: err => { observer.error(err); }
        });
      };
      fr.onerror = (e) => observer.error(e);
      fr.readAsDataURL(file);
    });
  }

  updateBusinessHours(hours: BusinessHoursDay[]): Observable<boolean> {
    return this.updateShopProfile({ businessHours: hours }).pipe(switchMap(() => of(true)));
  }

  updateDeliverySettings(settings: DeliverySettings): Observable<boolean> {
    return this.updateShopProfile({ deliverySettings: settings }).pipe(switchMap(() => of(true)));
  }

  // keep the compatibility helpers for tests
  private _defaultBusinessHours() {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    return days.map(d => ({ day: d, enabled: true, shifts: [{ open: '09:00', close: '18:00' }] }));
  }
}
