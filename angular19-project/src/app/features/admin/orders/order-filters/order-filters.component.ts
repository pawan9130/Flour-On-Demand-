import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <input placeholder="Search order ID or customer" #q (input)="apply(q.value)" />
      <select #s (change)="applyFilters(s.value)">
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
      </select>
    </div>
  `
})
export class OrderFiltersComponent {
  @Output() filter = new EventEmitter<any>();
  apply(v:any){ this.filter.emit({ q: v }); }
  applyFilters(v:any){ this.filter.emit({ status: v }); }
}
