import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bulk-order-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bulk-order-form.component.html'
})
export class BulkOrderFormComponent {
  @Output() saved = new EventEmitter<void>();
  save() { alert('Bulk order product saved (mock)'); this.saved.emit(); }
}
