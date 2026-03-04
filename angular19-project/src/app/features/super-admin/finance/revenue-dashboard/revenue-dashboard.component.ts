import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-revenue-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue-dashboard.component.html',
  styleUrls: ['./revenue-dashboard.component.css']
})
export class RevenueDashboardComponent implements OnInit {
  summary: any = { totalRevenue: 0 };

  constructor(private svc: FinanceService) {}

  ngOnInit(): void { this.load(); }

  load(){ this.svc.getRevenueData().subscribe(r => this.summary = r); }
}
