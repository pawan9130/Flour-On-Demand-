import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-filters.component.html'
})
export class OrderFiltersComponent {
  q = '';
  @Output() apply = new EventEmitter<any>();

  applyFilters(){ this.apply.emit({ q: this.q }); }
}
