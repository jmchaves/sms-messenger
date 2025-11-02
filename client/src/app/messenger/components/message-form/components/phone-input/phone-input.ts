import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './phone-input.html',
  styleUrl: './phone-input.scss',
})
export class PhoneInput {
  value = model<string>('');
}

