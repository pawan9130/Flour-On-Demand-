import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-commission-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commission-management.component.html'
})
export class CommissionManagementComponent implements OnInit {
  settings: any = {};
  Infinity = Number.POSITIVE_INFINITY;

  constructor(private svc: FinanceService) {}

  ngOnInit(): void { this.svc.getCommissionSettings().subscribe(s => this.settings = s); }

  save(){ this.svc.updateCommissionSettings(this.settings).subscribe(()=>alert('Saved')); }
}

