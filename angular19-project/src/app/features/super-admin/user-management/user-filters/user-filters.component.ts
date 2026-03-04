import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-filters.component.html'
})
export class UserFiltersComponent {
  q = '';
  @Output() apply = new EventEmitter<any>();

  applyFilters(){ this.apply.emit({ q: this.q }); }
}
