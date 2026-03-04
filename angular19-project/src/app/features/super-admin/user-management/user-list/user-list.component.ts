import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserManagementService, UserRecord } from '../user-management.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  q = '';
  users: UserRecord[] = [];
  total = 0;
  selected: Record<string, boolean> = {};

  constructor(private svc: UserManagementService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load(){ this.svc.getUsers({ q: this.q }).subscribe(r => { this.users = r.items; this.total = r.total; }); }

  view(u: UserRecord) { this.router.navigate(['super-admin','users', u.id]); }
  toggle(u: UserRecord) { this.selected[u.id] = !this.selected[u.id]; }
  bulkDelete() { const ids = Object.keys(this.selected).filter(k => this.selected[k]); ids.forEach(id => this.svc.deleteUser(id).subscribe(()=>this.load())); }

  block(u: UserRecord){ if(confirm('Block user?')) this.svc.blockUser(u.id).subscribe(()=>this.load()); }
  unblock(u: UserRecord){ this.svc.unblockUser(u.id).subscribe(()=>this.load()); }
  remove(u: UserRecord){ if(confirm('Delete user?')) this.svc.deleteUser(u.id).subscribe(()=>this.load()); }
}
