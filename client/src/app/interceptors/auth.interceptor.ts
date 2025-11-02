import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Clone the request and add headers
  let authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // Add authorization header if token exists
  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: token
      }
    });
  }

  // Handle the request and catch any 401 errors
  return next(authReq).pipe(
    catchError((error) => {
      // If we get a 401 and we're not already on the login page, redirect to login
      if (error.status === 401 && !router.url.includes('/login')) {
        // Clear auth data and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

