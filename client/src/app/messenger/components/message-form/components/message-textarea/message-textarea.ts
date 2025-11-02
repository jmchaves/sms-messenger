import { Component, model, input, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-textarea',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './message-textarea.html',
  styleUrl: './message-textarea.scss',
})
export class MessageTextarea {
  value = model<string>('');
  maxChars = input<number>(250);
  rows = input<number>(8);
  
  messageLength = computed(() => this.value().length);
  
  isWarning = computed(() => {
    const length = this.messageLength();
    const max = this.maxChars();
    return length > max * 0.8 && length < max;
  });
  
  isMaxed = computed(() => this.messageLength() === this.maxChars());
}

