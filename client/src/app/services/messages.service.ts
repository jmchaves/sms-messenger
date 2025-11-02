import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Message } from '../messenger/types/message.interface';

export interface SendMessageRequest {
  receiver_phone_number: string;
  text: string;
}

export interface MessageResponse {
  message?: string;
  data?: Message;
  error?: string;
  details?: string[];
}

export interface MessagesListResponse {
  data: Message[];
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private http = inject(HttpClient);
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Send a new message
   */
  sendMessage(messageData: SendMessageRequest): Observable<Message> {
    this.loadingSubject.next(true);
    
    return this.http.post<MessageResponse>(
      `${environment.apiUrl}/messages`,
      { message: messageData }
    ).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to send message');
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Get all messages for the current user
   */
  getMessages(): Observable<Message[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<MessagesListResponse>(
      `${environment.apiUrl}/messages`
    ).pipe(
      map(response => response.data || []),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Get a specific message by ID
   */
  getMessage(id: string): Observable<Message> {
    this.loadingSubject.next(true);
    
    return this.http.get<MessageResponse>(
      `${environment.apiUrl}/messages/${id}`
    ).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Message not found');
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
      } else if (error.status === 404) {
        errorMessage = error.error?.error || 'Message not found';
      } else if (error.status === 422) {
        errorMessage = error.error?.details?.join(', ') || 'Validation error';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.error?.error || error.error?.message || 'An unexpected error occurred';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}

