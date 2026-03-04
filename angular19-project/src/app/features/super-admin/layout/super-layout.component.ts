import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SuperHeaderComponent } from '../header/super-header.component';
import { SuperSidebarComponent } from '../sidebar/super-sidebar.component';

@Component({
  selector: 'app-super-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SuperHeaderComponent, SuperSidebarComponent],
  templateUrl: './super-layout.component.html',
  styleUrls: ['./super-layout.component.css']
})
export class SuperLayoutComponent {}
