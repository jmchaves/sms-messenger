import { Component, signal, inject, OnInit } from '@angular/core';
import { Message } from './types/message.interface';
import { MessengerHeader } from './components/messenger-header/messenger-header';
import { MessageForm, MessageFormData } from './components/message-form/message-form';
import { MessageHistory } from './components/message-history/message-history';
import { MessagesService } from '../services/messages.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [CommonModule, MessengerHeader, MessageForm, MessageHistory],
  templateUrl: './messenger.html',
  styleUrl: './messenger.scss',
})
export class Messenger implements OnInit {
  private messagesService = inject(MessagesService);
  
  messages = signal<Message[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.messagesService.getMessages().subscribe({
      next: (messages) => {
        this.messages.set(messages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.error.set(error.message);
        this.loading.set(false);
      }
    });
  }

  onMessageSubmit(formData: MessageFormData): void {
    this.loading.set(true);
    this.error.set(null);
    
    const messageData = {
      receiver_phone_number: formData.phoneNumber,
      text: formData.message
    };
    
    this.messagesService.sendMessage(messageData).subscribe({
      next: (message) => {
        // Add the new message to the beginning of the list
        this.messages.update(msgs => [message, ...msgs]);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.error.set(error.message);
        this.loading.set(false);
        alert(`Failed to send message: ${error.message}`);
      }
    });
  }
}
