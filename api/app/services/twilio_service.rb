class TwilioService
  class TwilioError < StandardError; end
  class ConfigurationError < TwilioError; end
  class SendMessageError < TwilioError; end

  attr_reader :client

  def initialize
    validate_configuration!
    @client = Twilio::REST::Client.new(account_sid, auth_token)
  end

  # Send an SMS message
  # @param to [String] The recipient's phone number (E.164 format recommended)
  # @param body [String] The message text content
  # @param from [String, nil] Optional sender phone number (uses default if not provided)
  # @return [Hash] Response with message details
  def send_sms(to:, body:, from: nil)
    validate_send_params!(to, body)

    sender_number = from || default_sender_phone

    # Build message parameters
    message_params = {
      to: '+18777804236',
      from: sender_number,
      body: body
    }

    # Only add status callback in production or when explicitly configured
    if Rails.env.production? || ENV['APP_BASE_URL'].present?
      message_params[:status_callback] = status_callback_url
    end
    
    # Create message using keyword arguments (Twilio Ruby SDK v5.x+ syntax)
    message = client.messages.create(**message_params)

    {
      success: true,
      sid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      body: message.body,
      error_message: message.error_message
    }
  rescue Twilio::REST::RestError => e
    handle_twilio_error(e)
  rescue StandardError => e
    Rails.logger.error("Unexpected error in TwilioService: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    raise SendMessageError, "Failed to send SMS: #{e.message}"
  end

  # Get message status by SID
  # @param message_sid [String] The Twilio message SID
  # @return [Hash] Message status information
  def get_message_status(message_sid)
    message = client.messages(message_sid).fetch

    {
      sid: message.sid,
      status: message.status,
      error_code: message.error_code,
      error_message: message.error_message
    }
  rescue Twilio::REST::RestError => e
    handle_twilio_error(e)
  end

  private

  def account_sid
    ENV['TWILIO_ACCOUNT_SID']
  end

  def auth_token
    ENV['TWILIO_AUTH_TOKEN']
  end

  def default_sender_phone
    ENV['TWILIO_PHONE_NUMBER']
  end

  def status_callback_url
    # Construct the webhook URL for Twilio status callbacks
    base_url = ENV['APP_BASE_URL'] || 'http://localhost:3000'
    "#{base_url}/api/v1/twilio/status_callback"
  end

  def validate_configuration!
    missing_configs = []
    missing_configs << 'TWILIO_ACCOUNT_SID' if account_sid.blank?
    missing_configs << 'TWILIO_AUTH_TOKEN' if auth_token.blank?
    missing_configs << 'TWILIO_PHONE_NUMBER' if default_sender_phone.blank?

    if missing_configs.any?
      raise ConfigurationError, 
            "Missing required Twilio configuration: #{missing_configs.join(', ')}"
    end
  end

  def validate_send_params!(to, body)
    raise ArgumentError, 'Recipient phone number is required' if to.blank?
    raise ArgumentError, 'Message body is required' if body.blank?
    raise ArgumentError, 'Message body exceeds 1600 characters' if body.length > 1600
  end

  def handle_twilio_error(error)
    error_details = {
      code: error.code,
      message: error.message,
      status: error.status_code
    }

    Rails.logger.error("Twilio API Error: #{error_details}")

    raise SendMessageError, format_error_message(error)
  end

  def format_error_message(error)
    case error.code
    when 21211
      "Invalid phone number format. Please use E.164 format (e.g., +1234567890)"
    when 21614
      "Invalid 'To' phone number"
    when 21408
      "Permission denied for this phone number"
    when 21610
      "Message cannot be sent to landline or unreachable number"
    when 21659
      "The 'From' phone number is not registered in your Twilio account. " \
      "Please use a Twilio phone number or verify this number in your Twilio console."
    when 21606
      "The 'From' phone number is not a valid, SMS-capable inbound phone number for your account"
    when 21608
      "The 'To' number is not currently reachable via SMS"
    else
      "Twilio error (#{error.code}): #{error.message}"
    end
  end
end

