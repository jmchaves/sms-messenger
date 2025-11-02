import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-card',
  standalone: true,
  templateUrl: './form-card.html',
  styleUrl: './form-card.scss',
})
export class FormCard {
  title = input.required<string>();
  subtitle = input.required<string>();
  icon = input<'plus' | 'message'>('plus');
}

