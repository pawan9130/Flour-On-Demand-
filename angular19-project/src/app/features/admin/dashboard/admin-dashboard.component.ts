import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements AfterViewInit {
  @ViewChild('salesChart', { static: true }) salesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productsChart', { static: true }) productsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart', { static: true }) statusChart!: ElementRef<HTMLCanvasElement>;
  stats: any = {};

  constructor(private adminSvc: AdminService) {}

  ngOnInit(): void {
    // fallback: use getAdmins to produce a simple dashboard summary
    this.adminSvc.getAdmins().subscribe(list => {
      this.stats.totalAdmins = list.length;
      this.stats.totalOrders = 0;
      this.stats.totalRevenue = 0;
    });
  }

  async ngAfterViewInit(){
    // Chart rendering skipped if Chart.js isn't present; keep graceful degradation
    try{
      const Chart = (window as any).Chart;
      if (!Chart) { console.warn('Chart.js not available'); return; }
      const salesCtx = this.salesChart.nativeElement.getContext('2d');
      new Chart(salesCtx, { type: 'line', data: { labels:['Jan','Feb','Mar','Apr','May'], datasets:[{label:'Sales',data:[120,200,150,300,250], borderColor:'#8B4513', backgroundColor:'rgba(139,69,19,0.1)'}] } });
      const prodCtx = this.productsChart.nativeElement.getContext('2d');
      new Chart(prodCtx, { type: 'bar', data: { labels:['A','B','C'], datasets:[{label:'Top products',data:[50,40,30], backgroundColor:'#2E5C4E'}] } });
      const stCtx = this.statusChart.nativeElement.getContext('2d');
      new Chart(stCtx, { type: 'pie', data: { labels:['Placed','Grinding','Delivered'], datasets:[{data:[10,5,20], backgroundColor:['#F5DEB3','#8B4513','#2E5C4E']}] } });
    }catch(err){ console.warn('Chart rendering failed', err); }
  }
}

