import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permissions.component.html'
})
export class RolePermissionsComponent implements OnInit {
  roles: any[] = [];
  permissions = ['dashboard.view','dashboard.export','orders.view','orders.update','orders.cancel','orders.refund','products.create','products.read','products.update','products.delete','users.view','users.block','users.delete','reports.view','reports.export','reports.schedule','settings.view','settings.update'];

  constructor(private svc: SettingsService) {}

  ngOnInit(): void { this.svc.getRoles().subscribe(r=>this.roles = r || []); }

  toggle(role:any, perm:string){
    const has = role.permissions.includes(perm);
    role.permissions = has ? role.permissions.filter((p:any)=>p!==perm) : [...role.permissions, perm];
    this.svc.updateRolePermissions(role.name, role.permissions).subscribe();
  }
}
