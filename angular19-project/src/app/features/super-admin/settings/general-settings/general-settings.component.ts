import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-settings.component.html'
})
export class GeneralSettingsComponent implements OnInit {
  settings: any = {};

  constructor(private svc: SettingsService) {}

  ngOnInit(): void { this.svc.getSettings('general').subscribe(s=>this.settings = s || {}); }

  save(){ this.svc.updateSettings('general', this.settings).subscribe(()=>alert('Saved')); }
}
