import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-sms-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sms-settings.component.html'
})
export class SmsSettingsComponent implements OnInit {
  sms: any = {};

  constructor(private svc: SettingsService) {}

  ngOnInit(): void { this.svc.getSettings('sms').subscribe(s=>this.sms = s || {}); }
  save(){ this.svc.updateSettings('sms', this.sms).subscribe(()=>alert('Saved')); }
}
