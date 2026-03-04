import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <select [(ngModel)]="status">
        <option value="accepted">Accepted</option>
        <option value="grinding">Grinding</option>
        <option value="ready">Ready</option>
        <option value="out">Out for Delivery</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button (click)="submit()">Update</button>
    </div>
  `
})
export class UpdateStatusComponent {
  @Input() status = '';
  @Output() updated = new EventEmitter<string>();
  submit(){ this.updated.emit(this.status); }
}
