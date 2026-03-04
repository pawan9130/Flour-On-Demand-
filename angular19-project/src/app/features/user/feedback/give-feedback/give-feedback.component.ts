import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../../../services/feedback.service';

@Component({
  selector: 'app-give-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h3>Give Feedback</h3>
      <label>Rating: <input type="number" [(ngModel)]="rating" min="1" max="5" /></label>
      <textarea [(ngModel)]="text" placeholder="Write your review"></textarea>
      <button (click)="submit()">Submit</button>
    </div>
  `
})
export class GiveFeedbackComponent {
  rating = 5;
  text = '';
  constructor(private fb: FeedbackService) {}
  submit() { this.fb.submitFeedback(0, { rating: this.rating, text: this.text }).subscribe(() => alert('Submitted')); }
}
