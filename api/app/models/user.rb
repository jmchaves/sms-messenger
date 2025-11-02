class User
  include Mongoid::Document
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Required for devise-jwt with Mongoid
  def self.primary_key
    '_id'
  end

  # JWT payload customization
  def jwt_payload
    { 'sub' => id.to_s }
  end

  # Called when JWT is dispatched (on login)
  def on_jwt_dispatch(token, payload)
    # Optional: can be used to track token dispatch
  end

  # Find user by JWT sub claim (user id)
  def self.find_for_jwt_authentication(sub)
    find(sub)
  end

  ## Database authenticatable
  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""

  ## Recoverable
  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time

  ## Rememberable
  field :remember_created_at, type: Time

  ## Trackable
  # field :sign_in_count,      type: Integer, default: 0
  # field :current_sign_in_at, type: Time
  # field :last_sign_in_at,    type: Time
  # field :current_sign_in_ip, type: String
  # field :last_sign_in_ip,    type: String

  ## Confirmable
  # field :confirmation_token,   type: String
  # field :confirmed_at,         type: Time
  # field :confirmation_sent_at, type: Time
  # field :unconfirmed_email,    type: String # Only if using reconfirmable

  ## Lockable
  # field :failed_attempts, type: Integer, default: 0 # Only if lock strategy is :failed_attempts
  # field :unlock_token,    type: String # Only if unlock strategy is :email or :both
  # field :locked_at,       type: Time
  
  # Associations
  has_many :messages, dependent: :destroy
  
  include Mongoid::Timestamps
end
