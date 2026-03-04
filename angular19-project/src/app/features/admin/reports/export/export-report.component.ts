import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-export-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-report.component.html'
})
export class ExportReportComponent {
  constructor(private rs: ReportService) {}

  export(format: 'pdf'|'excel'|'csv'|'json'){
    this.rs.exportReport(format, {}).subscribe(r => {
      if (r.url) window.open(r.url, '_blank');
      else alert('Export ready');
    });
  }
}
