import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomOrderService {
  private api = inject(ApiService);

  placeOrder(body: any): Observable<any> {
    return this.api.post('customOrders', body);
  }

  getOrder(id: string | number) {
    return this.api.get('customOrders', id);
  }
}
