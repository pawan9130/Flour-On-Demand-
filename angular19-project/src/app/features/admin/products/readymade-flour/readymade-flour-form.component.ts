import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-readymade-flour-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './readymade-flour-form.component.html'
})
export class ReadymadeFlourFormComponent {
  @Output() saved = new EventEmitter<void>();
  save() { alert('Readymade product saved (mock)'); this.saved.emit(); }
}
