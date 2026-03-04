import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `<div><ng-content></ng-content></div>`
})
export class OrderSummaryComponent { @Input() details?: any; }
