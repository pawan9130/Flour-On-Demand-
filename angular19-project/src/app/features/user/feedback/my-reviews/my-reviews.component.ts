import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../../../services/feedback.service';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h3>My Reviews</h3>
      <div *ngFor="let r of reviews">{{r.shopName}} — {{r.rating}} ★ — {{r.text}}</div>
    </div>
  `
})
export class MyReviewsComponent implements OnInit {
  reviews: any[] = [];
  constructor(private fb: FeedbackService) {}
  ngOnInit(): void { this.fb.getUserReviews().subscribe(r => this.reviews = r); }
}
