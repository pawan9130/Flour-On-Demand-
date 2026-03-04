import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private auth: AuthService
  ) {}

  ngOnInit() { 
    this.form = this.fb.group({ 
      userid: ['', Validators.required], 
      password: ['', Validators.required] 
    });
    
    // Redirect if already logged in
    if (this.auth.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  submit() {
    this.error = null;
    if (this.form.invalid) { 
      this.error = 'Enter credentials'; 
      return; 
    }
    
    this.loading = true;
    const { userid, password } = this.form.value;
    
    this.auth.login({ userId: userid, password }).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Login successful', res);
        
        // Navigate based on role
        if (res.redirectUrl) {
          this.router.navigateByUrl(res.redirectUrl).then(ok => {
            if (!ok) this.error = 'Navigation failed';
          });
        } else {
          this.redirectBasedOnRole();
        }
      },
      error: (err) => {
        this.loading = false;
        // Show popup for activation/suspension messages and also set inline error
        if (err?.message) {
          try { alert(err.message); } catch (e) { /* noop */ }
        }
        this.error = err?.message || 'Invalid credentials';
      }
    });
  }

  private redirectBasedOnRole() {
    const role = this.auth.getUserRole();
    
    switch(role) {
      case 'superadmin':
        this.router.navigate(['/super-admin/dashboard']);
        break;
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'user':
        this.router.navigate(['/user/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}