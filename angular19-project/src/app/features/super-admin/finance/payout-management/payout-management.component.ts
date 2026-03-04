import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-payout-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payout-management.component.html'
})
export class PayoutManagementComponent implements OnInit {
  queue: any[] = [];
  constructor(private svc: FinanceService) {}
  ngOnInit(): void { this.load(); }
  load(){ this.svc.getPayoutQueue().subscribe(q=> this.queue = q); }
  process(p: any){ const confirmMsg = `Process payout to ${p.shop} for ₹${p.amount}?`; if(!confirm(confirmMsg)) return; this.svc.processPayout(p).subscribe(r=>{ if(r.ok) { alert('Processed (mock)'); this.load(); } }); }
}
