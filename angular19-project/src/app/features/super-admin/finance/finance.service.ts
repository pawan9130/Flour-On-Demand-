import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private mockCommission = {
    platformPercent: 8,
    minimumFee: 100,
    slabs: [
      { from: 0, to: 10000, rate: 5 },
      { from: 10000, to: 50000, rate: 8 },
      { from: 50000, to: 100000, rate: 10 },
      { from: 100000, to: Infinity, rate: 12 }
    ]
  };

  constructor() {}

  getRevenueData(period: { from?: string; to?: string } = {}): Observable<any> {
    const series = Array.from({ length: 12 }).map((_, i) => ({ label: `M${i+1}`, value: Math.floor(Math.random() * 100000) + 50000 }));
    const summary = { totalRevenue: series.reduce((s:any, x:any) => s + x.value, 0), monthly: series };
    return of(summary).pipe(delay(200));
  }

  getCommissionSettings(): Observable<any> {
    return of(this.mockCommission).pipe(delay(120));
  }

  updateCommissionSettings(settings: any): Observable<boolean> { this.mockCommission = { ...this.mockCommission, ...settings }; return of(true).pipe(delay(120)); }

  getPayoutQueue(): Observable<any[]> {
    const queue = Array.from({ length: 6 }).map((_, i) => ({ id: `p${i+1}`, shop: `Shop ${i+1}`, amount: Math.floor(Math.random()*50000), period: '2026-02-01 to 2026-02-28', status: 'PENDING' }));
    return of(queue).pipe(delay(150));
  }

  processPayout(payoutData: any): Observable<{ ok: boolean }> { console.log('process payout', payoutData); return of({ ok: true }).pipe(delay(200)); }

  getSubscriptionPlans(): Observable<any[]> {
    const plans = [ { name: 'Basic', price: 999 }, { name: 'Standard', price: 1999 }, { name: 'Premium', price: 4999 } ];
    return of(plans).pipe(delay(120));
  }

  updateSubscriptionPlan(plan: any): Observable<boolean> { console.log('update plan', plan); return of(true).pipe(delay(120)); }

  getFinancialReports(type: string, period: any): Observable<any> {
    return of({ type, period, url: `https://cdn.example.com/financials/${Date.now()}.pdf` }).pipe(delay(200));
  }
}
