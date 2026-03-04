import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-super-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './super-sidebar.component.html',
  styleUrls: ['./super-sidebar.component.scss']
})
export class SuperSidebarComponent {
  collapsed = false;
  @HostBinding('class.collapsed') get isCollapsed() { return this.collapsed; }

  toggle() { this.collapsed = !this.collapsed; }
}
