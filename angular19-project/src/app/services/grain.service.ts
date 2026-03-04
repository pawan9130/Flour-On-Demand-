import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GrainService {
  private api = inject(ApiService);

  listGrains(): Observable<any[]> {
    return this.api.get<any[]>('grains');
  }

  listProteinGrains(): Observable<any[]> {
    return this.api.get<any[]>('proteinGrains');
  }

  listGrindingOptions(): Observable<any[]> {
    return this.api.get<any[]>('grindingOptions');
  }
}
