import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports-dashboard.component.html',
  styleUrls: ['./reports-dashboard.component.css']
})
export class ReportsDashboardComponent implements OnInit {
  summary: any = { totalSales: 0, totalOrders: 0, avgOrderValue: 0, totalCustomers: 0 };
  range = { from: '', to: '' };

  constructor(private rs: ReportService) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0,10);
    this.range = { from: today, to: today };
    this.load();
  }

  load() {
    this.rs.getSalesReport(this.range).subscribe(res => {
      this.summary.totalSales = res.totals.totalSales;
      this.summary.totalOrders = res.totals.totalOrders;
      this.summary.avgOrderValue = Math.round(res.totals.totalSales / Math.max(1, res.totals.totalOrders));
      this.summary.totalCustomers = 120; // mock
    });
  }
}
