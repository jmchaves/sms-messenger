import { Component, signal, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormCard } from './components/form-card/form-card';
import { PhoneInput } from './components/phone-input/phone-input';
import { MessageTextarea } from './components/message-textarea/message-textarea';
import { FormActions } from './components/form-actions/form-actions';

export interface MessageFormData {
  phoneNumber: string;
  message: string;
}

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [FormsModule, FormCard, PhoneInput, MessageTextarea, FormActions],
  templateUrl: './message-form.html',
  styleUrl: './message-form.scss',
})
export class MessageForm {
  phoneNumber = signal('');
  message = signal('');
  maxChars = 250;

  // Output event when form is submitted
  submitMessage = output<MessageFormData>();

  isFormValid = computed(() => {
    return this.phoneNumber().trim().length > 0 && 
           this.message().trim().length > 0 && 
           this.message().length <= this.maxChars;
  });

  onSubmit(): void {
    if (this.isFormValid()) {
      this.submitMessage.emit({
        phoneNumber: this.phoneNumber(),
        message: this.message()
      });
      this.clear();
    }
  }

  clear(): void {
    this.phoneNumber.set('');
    this.message.set('');
  }
}

