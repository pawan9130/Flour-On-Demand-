import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-super-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-header.component.html'
})
export class SuperHeaderComponent {
  currentUser: any = null;
  constructor(private auth: AuthService, private router: Router) {
    this.auth.currentUser$.subscribe(u => this.currentUser = u);
  }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
  onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    const email = img.getAttribute('data-email') || '';
    const seed = encodeURIComponent(email || img.src || Date.now().toString());
    img.src = `https://i.pravatar.cc/48?u=${seed}`;
  }
}
