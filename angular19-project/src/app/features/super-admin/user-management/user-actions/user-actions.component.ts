import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-actions.component.html'
})
export class UserActionsComponent {
  @Input() userId?: string;
  constructor(private svc: UserManagementService) {}

  block(){ if(this.userId) this.svc.blockUser(this.userId).subscribe(()=>alert('Blocked')); }
  unblock(){ if(this.userId) this.svc.unblockUser(this.userId).subscribe(()=>alert('Unblocked')); }
  delete(){ if(this.userId && confirm('Delete user?')) this.svc.deleteUser(this.userId).subscribe(()=>alert('Deleted')); }
}
