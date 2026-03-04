import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-customer-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-report.component.html'
})
export class CustomerReportComponent implements OnInit {
  customers: any[] = [];

  constructor(private rs: ReportService) {}

  ngOnInit(): void {
    this.rs.getCustomerReport({}).subscribe(r => this.customers = r.customers);
  }
}
