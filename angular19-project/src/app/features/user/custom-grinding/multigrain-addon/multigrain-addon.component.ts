import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultigrainAddon } from '../../../../models/custom-grinding.model';

@Component({
  selector: 'app-multigrain-addon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multigrain-addon.component.html'
})
export class MultigrainAddonComponent {
  @Input() addons: MultigrainAddon[] = [];
  @Output() change = new EventEmitter<MultigrainAddon[]>();

  toggle(a: MultigrainAddon, checked: boolean) {
    if (!checked) a.selectedPercentage = undefined;
    else a.selectedPercentage = a.selectedPercentage ?? 10;
    this.change.emit(this.addons);
  }

  setPercent(a: MultigrainAddon, pct: number) {
    a.selectedPercentage = pct;
    this.change.emit(this.addons);
  }
}
