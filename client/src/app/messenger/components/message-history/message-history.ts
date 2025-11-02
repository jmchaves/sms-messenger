import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../types/message.interface';
import { MessageItem } from '../message-item/message-item';

@Component({
  selector: 'app-message-history',
  standalone: true,
  imports: [CommonModule, MessageItem],
  templateUrl: './message-history.html',
  styleUrl: './message-history.scss',
})
export class MessageHistory {
  messages = input.required<Message[]>();
}

