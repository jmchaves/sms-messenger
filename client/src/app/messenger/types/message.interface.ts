export interface Message {
  id: string;
  sender_phone_number: string;
  receiver_phone_number: string;
  text: string;
  sent_at: string | Date;
  status: 'sent' | 'in_process' | 'not_sent';
  twilio_sid?: string;
  user_id: string;
  delivery_status?: string;
  delivery_error_code?: number;
  delivery_error_message?: string;
  delivered_at?: string | Date;
}

