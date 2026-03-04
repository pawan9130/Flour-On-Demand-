import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrainSelection } from '../../../..//models/custom-grinding.model';

@Component({
  selector: 'app-grain-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grain-selector.component.html'
})
export class GrainSelectorComponent {
  @Input() available: GrainSelection[] = [];
  @Output() change = new EventEmitter<GrainSelection[]>();

  toggleSelect(g: GrainSelection, checked: boolean) {
    if (!checked) {
      g.quantityKg = 0;
    } else if (!g.quantityKg) {
      g.quantityKg = 1;
    }
    this.change.emit(this.available);
  }

  updateQty(g: GrainSelection, qty: number) {
    g.quantityKg = qty;
    this.change.emit(this.available);
  }
}
