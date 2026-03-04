import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div [ngStyle]="{height:height+'px',width:width} " class="skeleton"></div>`
})
export class LoadingSkeletonComponent{
  @Input() height = 16;
  @Input() width: string = '100%';
}
