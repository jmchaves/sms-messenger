module Api
  module V1
    class MessagesController < ApplicationController
      before_action :authenticate_user!

      # POST /api/v1/messages
      def create
        message = current_user.messages.build(message_params)
        message.sent_at = Time.current
        message.sender_phone_number ||= get_sender_phone_number
        message.status = 'in_process'
        
        if message.save
          # Send SMS via Twilio in the background
          send_sms_message(message)
          
          render json: {
            message: 'Message is being sent',
            data: message_response(message)
          }, status: :created
        else
          render json: {
            error: 'Failed to create message',
            details: message.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue TwilioService::ConfigurationError => e
        Rails.logger.error("Twilio configuration error: #{e.message}")
        render json: {
          error: 'SMS service is not properly configured',
          details: [e.message]
        }, status: :service_unavailable
      end

      # GET /api/v1/messages
      def index
        messages = current_user.messages.order(sent_at: :desc)
        
        render json: {
          data: messages.map { |message| message_response(message) }
        }, status: :ok
      end

      # GET /api/v1/messages/:id
      def show
        message = current_user.messages.find(params[:id])
        
        render json: {
          data: message_response(message)
        }, status: :ok
      rescue Mongoid::Errors::DocumentNotFound
        render json: {
          error: 'Message not found'
        }, status: :not_found
      end

      private

      def message_params
        params.require(:message).permit(:receiver_phone_number, :text)
      end

      def get_sender_phone_number
        # TODO: Update this to use current_user.phone_number when you add that field to User model
        # For now, using Twilio's configured phone number
        ENV['TWILIO_PHONE_NUMBER'] || ENV['DEFAULT_SENDER_PHONE'] || '+1234567890'
      end

      def send_sms_message(message)
        twilio_service = TwilioService.new
        
        result = twilio_service.send_sms(
          to: message.receiver_phone_number,
          body: message.text,
          from: message.sender_phone_number
        )

        if result[:success]
          message.update(
            status: 'sent',
            twilio_sid: result[:sid]
          )
          Rails.logger.info("SMS sent successfully: #{result[:sid]}")
        end
      rescue TwilioService::SendMessageError => e
        message.update(status: 'not_sent')
        Rails.logger.error("Failed to send SMS for message #{message.id}: #{e.message}")
        # Re-raise to be handled by the controller
        raise
      rescue StandardError => e
        message.update(status: 'not_sent')
        Rails.logger.error("Unexpected error sending SMS: #{e.message}")
        raise
      end

      def message_response(message)
        {
          id: message.id.to_s,
          sender_phone_number: message.sender_phone_number,
          receiver_phone_number: message.receiver_phone_number,
          text: message.text,
          sent_at: message.sent_at,
          status: message.status,
          twilio_sid: message.twilio_sid,
          user_id: message.user_id.to_s,
          delivery_status: message.delivery_status,
          delivery_error_code: message.delivery_error_code,
          delivery_error_message: message.delivery_error_message,
          delivered_at: message.delivered_at
        }
      end
    end
  end
end

