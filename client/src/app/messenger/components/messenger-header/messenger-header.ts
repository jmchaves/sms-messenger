import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-messenger-header',
  standalone: true,
  templateUrl: './messenger-header.html',
  styleUrl: './messenger-header.scss',
})
export class MessengerHeader {
  private authService = inject(AuthService);

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}

