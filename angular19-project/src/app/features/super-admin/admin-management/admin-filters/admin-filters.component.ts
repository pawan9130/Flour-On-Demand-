import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-filters.component.html'
})
export class AdminFiltersComponent {
  q = '';
  @Output() search = new EventEmitter<string>();

  apply(){ this.search.emit(this.q); }
}
