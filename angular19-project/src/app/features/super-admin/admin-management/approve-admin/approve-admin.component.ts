import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminManagementService } from '../admin-management.service';

@Component({
  selector: 'app-approve-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-admin.component.html'
})
export class ApproveAdminComponent {
  @Input() adminId?: string;

  constructor(private svc: AdminManagementService) {}

  approve() { if(this.adminId) this.svc.approveAdmin(this.adminId).subscribe(()=>alert('Approved')); }
  reject(reason?: string) { if(this.adminId) this.svc.updateAdmin(this.adminId, { status: 'INACTIVE' }).subscribe(()=>alert('Rejected')); }
}
