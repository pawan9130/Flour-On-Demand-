import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UserProfile { name: string; email: string; phone: string; memberSince: string }

@Injectable({ providedIn: 'root' })
export class UserService {
  private profile: UserProfile = { name: 'Asha', email: 'user@demo.com', phone: '+91-9000000000', memberSince: '2024-01-01' };

  getProfile(): Observable<UserProfile> { return of(this.profile); }
  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> { this.profile = { ...this.profile, ...data }; return of(this.profile); }
  uploadProfilePicture(_file: File): Observable<{ url: string }> { return of({ url: '' }); }
  changePassword(_oldPass: string, _newPass: string): Observable<{ success: boolean }> { return of({ success: true }); }
}
