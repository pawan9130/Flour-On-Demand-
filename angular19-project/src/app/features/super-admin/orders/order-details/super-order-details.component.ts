import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SuperOrderService } from '../super-order.service';        

@Component({
  selector: 'app-super-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-order-details.component.html'
})
export class SuperOrderDetailsComponent implements OnInit {
  order: any = null;

  constructor(private route: ActivatedRoute, private svc: SuperOrderService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.svc.getOrderDetails(id).subscribe(o => this.order = o);
  }

  override(status: string){ if(this.order) this.svc.overrideOrderStatus(this.order.id, status).subscribe(()=>alert('Status updated')); }
  promptAndOverride(){
    if(!this.order) return;
    const v = prompt('New status', this.order.status);
    if(v) this.override(v);
  }
}
