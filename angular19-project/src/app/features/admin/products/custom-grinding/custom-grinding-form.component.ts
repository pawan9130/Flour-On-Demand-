import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-grinding-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-grinding-form.component.html'
})
export class CustomGrindingFormComponent {
  @Output() saved = new EventEmitter<void>();
  save() { alert('Custom grinding product saved (mock)'); this.saved.emit(); }
}
