import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-user-activity-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="activity-log">
      <div *ngFor="let e of logs" class="entry">
        <div class="ts">{{ e.ts | date:'short' }}</div>
        <div class="action">{{ e.action }}</div>
        <div class="device">{{ e.device }}</div>
      </div>
      <div *ngIf="logs.length===0">No recent activity</div>
    </div>
  `
})
export class UserActivityLogComponent implements OnInit {
  @Input() userId!: string;
  logs: any[] = [];
  constructor(private svc: UserManagementService) {}
  ngOnInit() { if (this.userId) this.svc.getUserActivity(this.userId).subscribe(l => this.logs = l); }
}
