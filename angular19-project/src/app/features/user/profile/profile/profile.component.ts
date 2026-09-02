import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { UserWishlistListComponent } from '../../wishlist/wishlist-list.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UserWishlistListComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = {};

  constructor(private user: UserService) {}

  ngOnInit(): void { this.user.getProfile().subscribe(p => this.profile = p); }
}
