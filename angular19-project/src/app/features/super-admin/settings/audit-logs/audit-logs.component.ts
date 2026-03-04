import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit {
  logs: any[] = [];
  filters: any = { from: '', to: '', user: '' };

  constructor(private svc: SettingsService) {}

  ngOnInit(): void { this.load(); }
  load(){ this.svc.getAuditLogs(this.filters).subscribe(l=>this.logs = l || []); }
}
