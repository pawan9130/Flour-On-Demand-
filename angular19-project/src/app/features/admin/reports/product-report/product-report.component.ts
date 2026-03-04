import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-product-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-report.component.html'
})
export class ProductReportComponent implements OnInit {
  products: any[] = [];

  constructor(private rs: ReportService) {}

  ngOnInit(): void {
    this.rs.getProductReport({}).subscribe(r => this.products = r.products);
  }
}
