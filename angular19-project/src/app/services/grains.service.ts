import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens';

export interface Grain {
  id?: number;
  adminId: number;
  name: string;
  description: string;
  pricePerKg: number;
  available: boolean;
  image?: string;
  category: 'wheat' | 'millet' | 'rice' | 'pulse' | 'other';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class GrainsService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private apiUrl: string) {}

  getGrainsByAdmin(adminId: number): Observable<Grain[]> {
    return this.http.get<Grain[]>(`${this.apiUrl}/grains`, { 
      params: { adminId: adminId.toString() } 
    });
  }

  createGrain(grain: Grain): Observable<Grain> {
    return this.http.post<Grain>(`${this.apiUrl}/grains`, grain);
  }

  updateGrain(id: number, grain: Partial<Grain>): Observable<Grain> {
    return this.http.patch<Grain>(`${this.apiUrl}/grains/${id}`, grain);
  }

  deleteGrain(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/grains/${id}`);
  }

  toggleAvailability(id: number, available: boolean): Observable<Grain> {
    return this.http.patch<Grain>(`${this.apiUrl}/grains/${id}`, { available });
  }
}


