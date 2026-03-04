import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-super-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  tabs = [
    { path: 'general', label: 'General' },
    { path: 'roles', label: 'Role Permissions' },
    { path: 'email-templates', label: 'Email Templates' },
    { path: 'feature-flags', label: 'Feature Flags' },
    { path: 'sms', label: 'SMS Settings' },
    { path: 'audit-logs', label: 'Audit Logs' },
    { path: 'system-health', label: 'System Health' }
  ];
}
