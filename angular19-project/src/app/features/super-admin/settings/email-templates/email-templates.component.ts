import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-email-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-templates.component.html'
})
export class EmailTemplatesComponent implements OnInit {
  templates: any[] = [];
  editing: any = null;

  constructor(private svc: SettingsService) {}

  ngOnInit(): void { this.svc.getEmailTemplates().subscribe(t=>this.templates = t || []); }

  edit(t:any){ this.editing = { ...t }; }
  save(){ if(this.editing) this.svc.updateEmailTemplate(this.editing.id, this.editing).subscribe(()=>{ this.editing = null; this.svc.getEmailTemplates().subscribe(t=>this.templates=t); }); }
  test(){ if(this.editing) this.svc.testEmailTemplate(this.editing.id, prompt('Send test to:')||'').subscribe(r=>alert('Test sent')) }
}
