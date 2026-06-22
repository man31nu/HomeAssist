import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  showPassword = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    // If already logged in as admin, redirect to dashboard
    const user = this.authService.currentUserValue as any;
    if (user && user.role === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (user) {
      // If logged in as non-admin, sign them out or redirect them? 
      // Let's redirect them to their home layout
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res.data.role !== 'Admin') {
          // If a non-admin tries to login through the admin portal
          this.authService.logout();
          this.error = 'Access Denied: You do not have Administrator privileges.';
          this.loading = false;
          return;
        }
        // Success
        this.router.navigate(['/admin']);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
