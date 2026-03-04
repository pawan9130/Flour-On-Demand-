import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { OrderFiltersComponent } from '../order-filters/order-filters.component';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, OrderFiltersComponent],
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.css']
})
export class AdminOrderListComponent implements OnInit {
  orders: any[] = [];
  selected = new Set<any>();
  // track which order has message box open
  messageOpen = new Set<any>();
  // draft messages keyed by orderId
  messageDrafts: Record<string, string> = {};
  page = 1;
  loading = false;

  constructor(private svc: AdminOrderService) {}

  ngOnInit(): void { this.load(); }

  load(filters: any = {}) {
    this.loading = true;
    this.svc.getOrders(filters, this.page).subscribe(o => { this.orders = o; this.loading = false; });
  }

  nextPage() { this.page++; this.load(); }

  applyFilter(filters: any) { this.page = 1; this.load(filters); }

  toggleSelect(orderId: any, checked: boolean) {
    if (checked) this.selected.add(orderId); else this.selected.delete(orderId);
  }

  selectAll(checked: boolean) {
    if (checked) this.orders.forEach(o => this.selected.add(o.orderId)); else this.selected.clear();
  }

  bulkUpdateStatus(status: string) {
    const ids = Array.from(this.selected);
    ids.forEach(id => this.svc.updateOrderStatus(id, status).subscribe());
    this.selected.clear();
    this.load();
  }

  contactCustomer(o: any) { alert('Contacting ' + o.customer); }
  printInvoice(o: any) { alert('Print invoice for ' + o.orderId); }

  toggleMessageBox(o: any) {
    const id = o.orderId;
    if (this.messageOpen.has(id)) { this.messageOpen.delete(id); } else { this.messageOpen.add(id); }
  }

  sendMessage(o: any) {
    const id = o.orderId;
    const msg = (this.messageDrafts[id] || '').trim();
    if (!msg) { alert('Please enter a message'); return; }
    // reuse updateOrderStatus to attach notes without changing status
    this.svc.updateOrderStatus(id, o.status, msg).subscribe(() => {
      alert('Message sent to customer');
      this.messageOpen.delete(id);
      this.load();
    }, () => alert('Failed to send message'));
  }
}
