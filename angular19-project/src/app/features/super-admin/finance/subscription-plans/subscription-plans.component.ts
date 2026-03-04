import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-plans.component.html'
})
export class SubscriptionPlansComponent implements OnInit {
  plans: any[] = [];
  editing: any = null;
  constructor(private svc: FinanceService) {}
  ngOnInit(): void { this.load(); }
  load(){ this.svc.getSubscriptionPlans().subscribe(p=> this.plans = p); }
  edit(p: any){ this.editing = { ...p }; }
  save(){ this.svc.updateSubscriptionPlan(this.editing).subscribe(()=>{ alert('Saved (mock)'); this.editing=null; this.load(); }); }
  add(){ this.editing = { name:'New', price:0 }; }
}
