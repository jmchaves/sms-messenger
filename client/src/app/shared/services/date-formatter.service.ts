import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {
  /**
   * Formats a date for message display with consistent formatting
   * @param dateInput - Date string or Date object to format
   * @returns Formatted date string in the format: "Weekday, DD-MMM-YY HH:MM:SS UTC"
   */
  formatMessageDate(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // Validate the date
    if (Number.isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
    return `${dayName}, ${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC`;
  }

  /**
   * Formats a delivered date using modern Intl API for consistency
   * @param deliveredAt - Date string or Date object to format
   * @returns Formatted date string or null if invalid
   */
  formatDeliveredAt(deliveredAt?: string | Date): string | null {
    if (!deliveredAt) return null;

    const date = typeof deliveredAt === 'string' ? new Date(deliveredAt) : deliveredAt;

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }
}
