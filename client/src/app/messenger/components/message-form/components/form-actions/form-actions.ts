import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-actions.html',
  styleUrl: './form-actions.scss',
})
export class FormActions {
  disabled = input<boolean>(false);
  clearClick = output<void>();
  submitClick = output<void>();
  
  onClearClick(): void {
    this.clearClick.emit();
  }
  
  onSubmitClick(): void {
    this.submitClick.emit();
  }
}

