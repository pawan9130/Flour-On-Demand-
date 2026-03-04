import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService, UserRecord } from '../user-management.service';
import { UserActivityLogComponent } from '../user-activity-log/user-activity-log.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, UserActivityLogComponent],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: UserRecord | null = null;
  activity: any[] = [];
  activeTab: 'overview'|'orders'|'addresses'|'reviews'|'activity' = 'overview';

  constructor(private route: ActivatedRoute, private svc: UserManagementService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.svc.getUserDetails(id).subscribe(u => this.user = u);
    this.svc.getUserActivity(id).subscribe(a => this.activity = a);
  }

  setTab(t: any) { this.activeTab = t; }
  block(){ if(this.user) this.svc.blockUser(this.user.id).subscribe(()=>this.svc.getUserDetails(this.user!.id).subscribe(u=>this.user=u)); }
  unblock(){ if(this.user) this.svc.unblockUser(this.user.id).subscribe(()=>this.svc.getUserDetails(this.user!.id).subscribe(u=>this.user=u)); }
  sendNotif(){ const msg = prompt('Message'); if(msg && this.user) this.svc.sendNotification(this.user.id, msg).subscribe(()=>alert('Sent')); }
  remove(){ if (!this.user) return; this.svc.deleteUser(this.user.id).subscribe(()=>this.router.navigate(['super-admin','users'])); }
}
