import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../types/message.interface';
import { DateFormatterService } from '../../../shared/services/date-formatter.service';

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-item.html',
  styleUrl: './message-item.scss',
})
export class MessageItem {
  private dateFormatter = inject(DateFormatterService);
  
  message = input.required<Message>();

  formatDate(dateInput: string | Date): string {
    return this.dateFormatter.formatMessageDate(dateInput);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'in_process':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_sent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getDeliveryStatusIcon(deliveryStatus: string | undefined): string {
    const normalizedStatus = this.normalizeDeliveryStatus(deliveryStatus);

    if (!normalizedStatus) return '';

    switch (normalizedStatus) {
      case 'delivered':
        return '✓✓'; // Double check mark
      case 'sent':
        return '✓'; // Single check mark
      case 'failed':
      case 'undelivered':
        return '✗';
      default:
        return '○'; // Circle for pending/queued
    }
  }

  getDeliveryStatusColor(deliveryStatus: string | undefined): string {
    const normalizedStatus = this.normalizeDeliveryStatus(deliveryStatus);

    if (!normalizedStatus) return 'text-gray-400';

    switch (normalizedStatus) {
      case 'delivered':
        return 'text-green-600';
      case 'sent':
        return 'text-blue-500';
      case 'failed':
      case 'undelivered':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  }

  getDeliveryStatusText(deliveryStatus: string | undefined): string {
    const normalizedStatus = this.normalizeDeliveryStatus(deliveryStatus);

    if (!normalizedStatus) return '';

    return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
  }

  isDelivered(deliveryStatus: string | undefined): boolean {
    return this.normalizeDeliveryStatus(deliveryStatus) === 'delivered';
  }

  formatDeliveredAt(deliveredAt?: string | Date): string | null {
    return this.dateFormatter.formatDeliveredAt(deliveredAt);
  }

  private normalizeDeliveryStatus(deliveryStatus: string | undefined): string | undefined {
    return deliveryStatus?.toLowerCase();
  }
}

