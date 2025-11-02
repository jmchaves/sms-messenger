class JwtDenylist
  include Mongoid::Document
  include Mongoid::Timestamps

  field :jti, type: String
  field :exp, type: Time

  index({ jti: 1 }, { unique: true })

  # Required for devise-jwt with Mongoid
  def self.primary_key
    '_id'
  end

  def self.jwt_revoked?(jti, user)
    exists?(jti: jti)
  end

  def self.revoke_jwt(payload, user)
    create!(jti: payload['jti'], exp: Time.at(payload['exp']))
  end
end

