import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminService } from '../super-admin.service';

@Component({
  selector: 'app-super-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-dashboard.component.html',
  styleUrls: ['./super-dashboard.component.css']
})
export class SuperDashboardComponent implements OnInit {
  stats: any = {};
  activities: any[] = [];
  approvals: any[] = [];

  constructor(private svc: SuperAdminService) {}

  ngOnInit(): void {
    this.svc.getSystemStats().subscribe(s => this.stats = s);
    this.svc.getRecentActivities(6).subscribe(a => this.activities = a);
    this.svc.getPendingApprovals().subscribe(p => this.approvals = p);
  }
}
