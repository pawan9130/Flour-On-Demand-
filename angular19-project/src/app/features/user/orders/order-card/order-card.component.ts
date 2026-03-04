import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styles: [`.card{background:#fff;padding:12px;border-radius:6px;margin-bottom:8px}.order-cancelled{background:#fff5f5;border:1px solid #f5c6c6}.cancel-msg{margin-top:8px;background:#fff2f2;padding:8px;border-radius:6px;border:1px solid #f3c0c0;font-size:13px;color:#802020}`]
})
export class OrderCardComponent {
  @Input() order: any;
}
