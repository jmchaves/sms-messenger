class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  # Associations
  belongs_to :user

  # Fields
  field :sender_phone_number, type: String
  field :receiver_phone_number, type: String
  field :text, type: String
  field :sent_at, type: Time
  field :status, type: String, default: 'in_process'
  field :twilio_sid, type: String
  
  # Delivery status fields from Twilio webhooks
  field :delivery_status, type: String
  field :delivery_error_code, type: Integer
  field :delivery_error_message, type: String
  field :delivered_at, type: Time

  # Validations
  validates :receiver_phone_number, presence: true
  validates :text, presence: true
  validates :status, inclusion: { in: %w[sent in_process not_sent] }
  validates :user, presence: true
  
  # Set sender_phone_number before validation if not present
  before_validation :set_default_sender, on: :create
  
  private
  
  def set_default_sender
    self.sender_phone_number ||= ENV['DEFAULT_SENDER_PHONE']
  end

  # Indexes
  index({ user_id: 1 })
  index({ sender_phone_number: 1 })
  index({ receiver_phone_number: 1 })
  index({ sent_at: -1 })
  index({ status: 1 })
  index({ twilio_sid: 1 }, { unique: true, sparse: true })
end

