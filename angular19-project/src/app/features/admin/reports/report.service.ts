import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface DateRange { from: string; to: string }

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor() {}

  getSalesReport(range: DateRange): Observable<any> {
    // return mock timeseries and aggregates
    const days = 7;
    const data = Array.from({ length: days }).map((_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 3600 * 1000).toISOString().slice(0,10),
      orders: Math.floor(Math.random() * 40) + 5,
      revenue: Math.floor(Math.random() * 5000) + 200
    }));
    const totals = { totalSales: data.reduce((s:any, d:any) => s + d.revenue, 0), totalOrders: data.reduce((s:any,d:any)=>s+d.orders,0) };
    return of({ data, totals }).pipe(delay(200));
  }

  getProductReport(filters: any): Observable<any> {
    const products = Array.from({ length: 10 }).map((_, i) => ({
      id: 'p' + i,
      name: `Product ${i+1}`,
      unitsSold: Math.floor(Math.random()*200),
      revenue: Math.floor(Math.random()*20000),
      rating: +(Math.random()*1.5+3.5).toFixed(1)
    }));
    return of({ products }).pipe(delay(200));
  }

  getCustomerReport(filters: any): Observable<any> {
    const customers = Array.from({ length: 8 }).map((_, i) => ({
      id: 'c'+i,
      name: `Customer ${i+1}`,
      contact: '9' + Math.floor(Math.random()*1e9).toString().padStart(9,'0'),
      totalOrders: Math.floor(Math.random()*10),
      totalSpent: Math.floor(Math.random()*5000)
    }));
    return of({ customers }).pipe(delay(200));
  }

  exportReport(format: 'pdf'|'excel'|'csv'|'json', payload: any): Observable<{ ok: boolean; url?: string }> {
    // mock export: return a downloadable url after delay
    return of({ ok: true, url: `https://cdn.example.com/reports/${Date.now()}.${format}` }).pipe(delay(300));
  }

  scheduleReport(cfg: any): Observable<{ ok: boolean }> {
    // mock scheduler
    console.log('Scheduling report', cfg);
    return of({ ok: true }).pipe(delay(150));
  }
}
