import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/messenger';

  // Email validation pattern
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/messenger'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/messenger';

    // Redirect to messenger if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isFormValid(): boolean {
    return this.email.trim() !== '' && 
           this.password.trim() !== '' && 
           this.emailPattern.test(this.email) &&
           this.password.length >= 6;
  }

  get emailError(): string {
    if (this.email && !this.emailPattern.test(this.email)) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  get passwordError(): string {
    if (this.password && this.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  onSubmit(): void {
    // Clear previous error
    this.errorMessage = '';

    // Validate form
    if (!this.isFormValid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    // Prevent double submission
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    // Call the login API
    this.authService.login({
      email: this.email.trim(),
      password: this.password
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.isLoading = false;
        // Navigate to the return URL or messenger page
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
        // Clear password on error for security
        this.password = '';
      }
    });
  }
}
