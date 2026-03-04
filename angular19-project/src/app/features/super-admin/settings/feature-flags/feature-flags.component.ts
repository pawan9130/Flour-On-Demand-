import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-flags.component.html'
})
export class FeatureFlagsComponent implements OnInit {
  features: any = {};

  constructor(private svc: SettingsService) {}

  ngOnInit(): void { this.svc.getSettings('features').subscribe(f=>this.features = f || {}); }
  save(){ this.svc.updateSettings('features', this.features).subscribe(()=>alert('Saved')); }
}
