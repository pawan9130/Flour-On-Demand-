import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-report.component.html'
})
export class SalesReportComponent implements OnInit {
  series: any[] = [];
  totals: any = {};
  Math = Math;

  constructor(private rs: ReportService) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0,10);
    this.rs.getSalesReport({ from: today, to: today }).subscribe(r => {
      this.series = r.data;
      this.totals = r.totals;
    });
  }
}
