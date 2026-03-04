import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grinding-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grinding-options.component.html'
})
export class GrindingOptionsComponent {
  @Input() selected: string | null = null;
  @Output() select = new EventEmitter<string>();

  options = [
    { key: 'very-fine', label: 'Very Fine (0-0.5mm)' },
    { key: 'fine', label: 'Fine (0.5-1mm)' },
    { key: 'medium', label: 'Medium (1-1.5mm)' },
    { key: 'coarse', label: 'Coarse (1.5-2mm)' },
    { key: 'very-coarse', label: 'Very Coarse (2mm+)' }
  ];

  choose(k: string) { this.select.emit(k); }
}
