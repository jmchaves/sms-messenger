import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  status: {
    code: number;
    message: string;
  };
  data?: {
    user: User;
  };
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/login`,
      { user: credentials },
      { observe: 'response' }
    ).pipe(
      tap(response => {
        // Extract JWT token from Authorization header
        const token = response.headers.get('Authorization');
        if (token && response.body?.data?.user) {
          this.setToken(token);
          this.setUser(response.body.data.user);
          this.currentUserSubject.next(response.body.data.user);
        }
      }),
      map(response => response.body as AuthResponse),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  logout(): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.http.delete(`${environment.apiUrl}/logout`).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        // Even if the server request fails, clear local auth data
        this.clearAuthData();
        this.router.navigate(['/login']);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during login';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      } else if (error.status === 401) {
        errorMessage = error.error?.status?.message || 'Invalid email or password';
      } else if (error.status === 422) {
        errorMessage = error.error?.errors?.join(', ') || 'Validation error';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.error?.status?.message || 'An unexpected error occurred';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}

