import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminManagementService, AdminRecord } from '../admin-management.service';

@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.css']
})
export class AdminDetailsComponent implements OnInit {
  admin: AdminRecord | null = null;
  activeTab: 'overview'|'shop'|'orders'|'earnings'|'reviews'|'performance' = 'overview';

  constructor(private route: ActivatedRoute, private svc: AdminManagementService, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { return; }
    this.svc.getAdminDetails(id).subscribe(a => this.admin = a);
  }

  setTab(t: any) { this.activeTab = t; }
  back() { this.router.navigate(['super-admin','admins']); }
  approve() { if (!this.admin) return; this.svc.approveAdmin(this.admin.id).subscribe(()=> this.svc.getAdminDetails(this.admin!.id).subscribe(a=> this.admin = a)); }
  suspend() { if (!this.admin) return; this.svc.suspendAdmin(this.admin.id).subscribe(()=> this.svc.getAdminDetails(this.admin!.id).subscribe(a=> this.admin = a)); }
}
 
