import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = (inject(API_BASE_URL) as string) || 'http://localhost:3000';

  findUsers(params: Record<string, any>): Observable<any[]> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(k => { 
      if (params[k] != null) httpParams = httpParams.set(k, String(params[k])); 
    });
    return this.http.get<any[]>(`${this.base.replace(/\/$/, '')}/users`, { params: httpParams });
  }

  findAdmins(params: Record<string, any>): Observable<any[]> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(k => { 
      if (params[k] != null) httpParams = httpParams.set(k, String(params[k])); 
    });
    return this.http.get<any[]>(`${this.base.replace(/\/$/, '')}/admins`, { params: httpParams });
  }

  findSuperAdmins(params: Record<string, any>): Observable<any[]> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(k => { 
      if (params[k] != null) httpParams = httpParams.set(k, String(params[k])); 
    });
    return this.http.get<any[]>(`${this.base.replace(/\/$/, '')}/superAdmins`, { params: httpParams });
  }

  createUser(body: any): Observable<any> {
    return this.http.post<any>(`${this.base.replace(/\/$/, '')}/users`, body);
  }

  // Generic CRUD helpers
  get<T = any>(path: string, id?: string | number, params?: Record<string, any>): Observable<T> {
    const url = id ? `${this.base.replace(/\/$/, '')}/${path}/${id}` : `${this.base.replace(/\/$/, '')}/${path}`;
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<T>(url, params ? { params: httpParams } : undefined);
  }

  delete(path: string, id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.base.replace(/\/$/, '')}/${path}/${id}`);
  }

  patch(path: string, id: string | number, body: any): Observable<any> {
    return this.http.patch<any>(`${this.base.replace(/\/$/, '')}/${path}/${id}`, body);
  }

  post(path: string, body: any): Observable<any> {
    return this.http.post<any>(`${this.base.replace(/\/$/, '')}/${path}`, body);
  }
}