import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-header.component.html'
})
export class UserHeaderComponent {
  query = '';
  cartCount = 0;
  notifications = 0;
  currentUser: any = null;

  constructor(private router: Router, private cart: CartService, private notificationsSvc: NotificationService, private auth: AuthService) {
    this.cart.cartCount$.subscribe(c => this.cartCount = c);
    this.notificationsSvc.unreadCount$.subscribe(n => this.notifications = n);
    this.auth.currentUser$.subscribe(u => this.currentUser = u);
  }

  get avatarUrl(): string {
    return this.currentUser?.profileImageUrl || this.currentUser?.avatarUrl || '/assets/avatar-default.png';
  }

  onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    const email = img.getAttribute('data-email') || '';
    const seed = encodeURIComponent(email || img.src || Date.now().toString());
    img.src = `https://i.pravatar.cc/48?u=${seed}`;
  }

  onSearch() {
    // naive navigation to search results
    this.router.navigate(['/user'], { queryParams: { q: this.query } });
  }

  goToCart() { this.router.navigate(['/cart']); }

  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
