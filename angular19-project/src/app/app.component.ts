import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NgIf, AsyncPipe, NgFor } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular19-project';
  user$: any;
  constructor(private auth: AuthService,private router: Router) {
    this.user$ = this.auth.currentUser$;
  }

  // logout() {
  //   this.authService.logout();
  // }

   logout() { this.auth.logout(); this.router.navigate(['/login']); }

  onAppAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    const email = img.getAttribute('data-email') || '';
    const seed = encodeURIComponent(email || img.src || Date.now().toString());
    img.src = `https://i.pravatar.cc/48?u=${seed}`;
  }
}
