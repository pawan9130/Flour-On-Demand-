import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminManagementService, AdminRecord } from '../admin-management.service';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  q = '';
  filtersOpen = false;
  admins: AdminRecord[] = [];
  total = 0;
  expanded: Record<string, boolean> = {};
  viewMode: 'grid' | 'list' = 'grid';
  statusFilter: 'ALL' | 'ACTIVE' | 'PENDING' | 'SUSPENDED' = 'ALL';

  constructor(private svc: AdminManagementService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.svc.getAdmins({ q: this.q }).subscribe(r => {
      let items = r.items || [];
      if (this.statusFilter && this.statusFilter !== 'ALL') {
        items = items.filter(i => (i.status || '').toUpperCase() === this.statusFilter);
      }
      this.admins = items; this.total = items.length;
    });
  }

  onSearchInput(e: any) {
    const v = (e.target as HTMLInputElement).value || '';
    this.q = v;
    if (!v.trim()) {
      // reset to last selected filter/view state
      this.load();
      return;
    }
    this.load();
  }

  toggleFilters() { this.filtersOpen = !this.filtersOpen; }

  view(id: string) { this.router.navigate(['super-admin','admins', id]); }

  toggleExpand(id: string) { this.expanded[id] = !this.expanded[id]; }

  approve(a: AdminRecord) {
    this.svc.approveAdmin(a.id).subscribe(() => {
      const msg = `Admin ${a.name} has been activated successfully.`;
      const ok = confirm(msg);
      if (ok) this.load();
    }, () => { alert('Failed to activate admin'); });
  }

  suspend(a: AdminRecord) {
    this.svc.suspendAdmin(a.id).subscribe(() => {
      const msg = `Admin ${a.name} has been suspended.`;
      const ok = confirm(msg);
      if (ok) this.load();
    }, () => { alert('Failed to suspend admin'); });
  }

  remove(a: AdminRecord) { if (confirm('Delete admin?')) this.svc.deleteAdmin(a.id).subscribe(() => this.load()); }

  setView(v: 'grid'|'list') { this.viewMode = v; }

  setStatus(s: 'ALL'|'ACTIVE'|'PENDING'|'SUSPENDED') { this.statusFilter = s; this.load(); }
}
