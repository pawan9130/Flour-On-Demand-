import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private store: any = {
    general: {
      platformName: 'MyPlatform',
      contactEmail: 'support@example.com',
      supportPhone: '+1-555-0100',
      address: '123 Main St',
      social: { twitter: '', facebook: '' },
      currency: 'USD',
      currencySymbol: '$',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      language: 'en',
      minOrderValue: 0,
      maxOrderValue: 100000,
      cancelLimitHours: 24,
      refundDays: 7,
      returnPolicy: 'Standard',
      deliveryDistanceKm: 50,
      passwordPolicy: { minLength: 8, special: true, numbers: true, expiryDays: 90 },
      loginAttemptLimit: 5,
      sessionTimeoutMinutes: 60,
      twoFactor: false
    },
    roles: [
      { name: 'Super Admin', permissions: ['*'] },
      { name: 'Admin', permissions: ['dashboard.view','orders.view','products.*'] },
      { name: 'User', permissions: ['orders.create','orders.view'] }
    ],
    emailTemplates: [
      { id: 'welcome', name: 'Welcome email', subject: 'Welcome to {{platform}}', html: '<p>Hi {{name}}, welcome!</p>', active: true },
      { id: 'order_confirm', name: 'Order confirmation', subject: 'Order {{orderId}} confirmed', html: '<p>Order details</p>', active: true }
    ],
    sms: { provider: 'twilio', credentials: {}, templates: [] },
    payment: { gateways: { razorpay: { enabled:false }, stripe: { enabled:false } }, fees: {} },
    features: { onlinePayments: true, multiLanguage: false }
  };

  constructor() {}

  getSettings(category: string): Observable<any> { return of(this.store[category] || null).pipe(delay(120)); }

  updateSettings(category: string, settings: any): Observable<any> {
    this.store[category] = { ...(this.store[category]||{}), ...settings };
    return of({ ok: true }).pipe(delay(120));
  }

  getRoles(): Observable<any[]> { return of(this.store.roles).pipe(delay(80)); }

  updateRolePermissions(roleName: string, permissions: string[]): Observable<any> {
    const idx = this.store.roles.findIndex((r:any)=>r.name===roleName);
    if(idx>=0) this.store.roles[idx].permissions = permissions;
    return of({ ok: true }).pipe(delay(120));
  }

  getEmailTemplates(): Observable<any[]> { return of(this.store.emailTemplates).pipe(delay(100)); }

  updateEmailTemplate(id: string, content: any): Observable<any> {
    const idx = this.store.emailTemplates.findIndex((t:any)=>t.id===id);
    if(idx>=0) this.store.emailTemplates[idx] = { ...this.store.emailTemplates[idx], ...content };
    return of({ ok: true }).pipe(delay(140));
  }

  testEmailTemplate(id: string, testEmail: string): Observable<any> {
    console.log('test email', id, testEmail);
    return of({ ok: true, sentTo: testEmail }).pipe(delay(200));
  }

  getAuditLogs(filters:any = {}): Observable<any[]> {
    const logs = Array.from({length:20}).map((_,i)=>({timestamp:Date.now()-i*60000, user: i%2? 'admin':'system', action: 'UPDATE_SETTINGS', details: {key:'general.platformName'}, ip: '127.0.0.1'}));
    return of(logs).pipe(delay(160));
  }

  getSystemHealth(): Observable<any> {
    const health = { api: 'OK', db: 'OK', storage: 'OK', memory: Math.round(Math.random()*80)+'%', cpu: Math.round(Math.random()*60)+'%', responseMs: 120 };
    return of(health).pipe(delay(200));
  }
}
