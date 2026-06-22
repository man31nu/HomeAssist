import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string | null = null;

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Customer', Validators.required],
      service_category: ['Electrician'], // default, only used if Provider
      phone: [''],
      address: ['']
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Send only the fields the backend accepts
    // (address is in a separate table; omit from register payload)
    const { name, email, password, role, service_category, phone } = this.registerForm.value;
    const payload: any = { name, email, password, role };
    if (role === 'Provider') {
      payload.service_category = service_category;
    }
    if (phone) payload.phone = phone;

    this.authService.register(payload)
      .subscribe({
        next: (res) => {
          const userRole = res.data?.role;
          if (this.returnUrl && this.returnUrl !== '/') {
            this.router.navigateByUrl(this.returnUrl);
          } else if (userRole === 'Provider') {
            this.router.navigate(['/provider']);
          } else {
            this.router.navigate(['/customer']);
          }
        },
        error: err => {
          this.error = err.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }
}
