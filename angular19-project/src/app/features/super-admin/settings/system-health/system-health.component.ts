import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-health.component.html'
})
export class SystemHealthComponent implements OnInit {
  health: any = {};

  constructor(private svc: SettingsService) {}

  ngOnInit(): void { this.svc.getSystemHealth().subscribe(h=>this.health = h); }
}
