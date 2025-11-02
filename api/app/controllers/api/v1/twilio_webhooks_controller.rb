module Api
  module V1
    class TwilioWebhooksController < ApplicationController
      # Skip CSRF token verification for Twilio webhooks
      skip_before_action :verify_authenticity_token
      # Skip authentication for webhooks
      skip_before_action :authenticate_user!
      
      before_action :verify_twilio_signature, only: [:status_callback]

      # POST /api/v1/twilio/status_callback
      def status_callback
        message_sid = params['MessageSid']
        message_status = params['MessageStatus']
        error_code = params['ErrorCode']
        error_message = params['ErrorMessage']
        
        Rails.logger.info("Received Twilio status callback for SID: #{message_sid}, Status: #{message_status}")
        Rails.logger.info("Full webhook params: #{params.except(:controller, :action).to_unsafe_h}")

        # Find the message by Twilio SID
        message = Message.find_by(twilio_sid: message_sid)
        
        if message
          update_params = {
            delivery_status: message_status
          }

          # Add error information if present
          if error_code.present?
            update_params[:delivery_error_code] = error_code
            update_params[:delivery_error_message] = error_message
          end

          # Set delivered_at timestamp if message was delivered
          if message_status == 'delivered'
            update_params[:delivered_at] = Time.current
          end

          message.update(update_params)
          
          Rails.logger.info("Updated message #{message.id} with delivery status: #{message_status}")

          head :ok
        else
          Rails.logger.warn("Message not found for Twilio SID: #{message_sid}")
          head :not_found
        end
      rescue StandardError => e
        Rails.logger.error("Error processing Twilio status callback: #{e.message}")
        Rails.logger.error(e.backtrace.join("\n"))
        head :internal_server_error
      end

      private

      def verify_twilio_signature
        # Skip verification in development/test environments for easier testing
        return true if Rails.env.development? || Rails.env.test?
        
        auth_token = ENV['TWILIO_AUTH_TOKEN']
        return head :unauthorized unless auth_token.present?

        validator = Twilio::Security::RequestValidator.new(auth_token)
        signature = request.headers['X-Twilio-Signature']
        url = request.original_url
        post_vars = params.except(:controller, :action).to_unsafe_h

        unless validator.validate(url, post_vars, signature)
          Rails.logger.warn("Invalid Twilio webhook signature")
          head :unauthorized
          return false
        end

        true
      end
    end
  end
end

