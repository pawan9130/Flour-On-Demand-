import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperOrderService } from '../super-order.service';

@Component({
  selector: 'app-refund-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './refund-management.component.html'
})
export class RefundManagementComponent implements OnInit {
  refunds: any[] = [];

  constructor(private svc: SuperOrderService) {}

  ngOnInit(): void { this.svc.getRefundRequests().subscribe(r=>this.refunds = r); }

  process(r:any){ this.svc.processRefund(r).subscribe(()=>{ alert('Processed (mock)'); this.ngOnInit(); }); }
}


