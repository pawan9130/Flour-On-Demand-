import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SuperOrderService, SuperOrder } from '../super-order.service';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  q = '';
  orders: SuperOrder[] = [];
  total = 0;
  selected: Record<string, boolean> = {};
  realtime = false;
  private _rtTimer: any = null;

  constructor(private svc: SuperOrderService) {}

  ngOnInit(): void { this.load(); }

  load(){ this.svc.getAllOrders({ q: this.q }).subscribe(r => { this.orders = r.items; this.total = r.total; }); }

  view(o: SuperOrder){ /* navigate to details - routerLink used in template */ }

  overrideStatus(o: SuperOrder){ const s = prompt('New status', o.status); if(s) this.svc.overrideOrderStatus(o.id, s).subscribe(()=>this.load()); }

  toggleSelect(o: SuperOrder){ this.selected[o.id] = !this.selected[o.id]; }

  bulkAction(action: string){ const ids = Object.keys(this.selected).filter(k => this.selected[k]); if(ids.length===0){ alert('Select orders first'); return; }
    if(action==='export') this.exportSelected(ids);
    if(action==='cancel') ids.forEach(id=> this.svc.overrideOrderStatus(id,'CANCELLED').subscribe(()=>this.load()));
  }

  exportSelected(ids: string[]){ const rows = this.orders.filter(o=>ids.includes(o.id)).map(o=>[o.id,o.placedAt,o.customerName,o.shopName,o.itemsSummary,o.amount,o.status]);
    const csv = ['id,placedAt,customer,shop,items,amount,status', ...rows.map(r=> r.map(c=> '"'+String(c).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); window.open(url, '_blank');
  }

  toggleRealtime(){ this.realtime = !this.realtime; if(this.realtime){ this._rtTimer = setInterval(()=> this._injectOrder(), 5000); } else { clearInterval(this._rtTimer); this._rtTimer = null; } }

  private _injectOrder(){ const fake: SuperOrder = { id: `ORD-${1000 + Math.floor(Math.random()*999)}`, placedAt: new Date().toISOString(), customerName: 'Live User', shopName: 'Live Shop', itemsSummary: '1 item', amount: Math.floor(Math.random()*500)+50, status: ['PLACED','ACCEPTED','PROCESSING','OUT_FOR_DELIVERY'][Math.floor(Math.random()*4)] };
    this.orders = [fake, ...this.orders]; this.total = this.orders.length;
  }
}
