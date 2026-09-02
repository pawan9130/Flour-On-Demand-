import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent {
  collapsed = false;
  wishlistCount = 0;

  constructor(private wishlistService: WishlistService) {
    this.wishlistService.count$.subscribe(count => this.wishlistCount = count);
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
