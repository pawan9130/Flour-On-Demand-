import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reviews.component.html'
})
export class MyReviewsComponent implements OnInit {
  reviews: any[] = [];
  constructor(private user: UserService){}
  ngOnInit(): void { this.user.getMyReviews().subscribe(r=>this.reviews = r); }
}
