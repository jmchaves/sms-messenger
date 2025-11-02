module Api
  module V1
    class SessionsController < Devise::SessionsController
      respond_to :json
      skip_before_action :verify_signed_out_user, only: [:destroy]
      before_action :configure_sign_in_params, only: [:create]
      
      def create
        user = User.find_for_database_authentication(email: params[:user][:email])
        
        if user && user.valid_password?(params[:user][:password])
          sign_in(user, store: false)
          render json: {
            status: { code: 200, message: 'Logged in successfully.' },
            data: {
              user: {
                id: user.id.to_s,
                email: user.email
              }
            }
          }, status: :ok
        else
          render json: {
            status: { code: 401, message: 'Invalid email or password.' }
          }, status: :unauthorized
        end
      end

      def destroy
        # Devise-JWT handles token revocation automatically via middleware
        # Just render success response
        render json: {
          status: { code: 200, message: 'Logged out successfully.' }
        }, status: :ok
      end
      
      def configure_sign_in_params
        devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
      end
      
      private

      def respond_with(resource, _opts = {})
        if resource.persisted?
          render json: {
            status: { code: 200, message: 'Logged in successfully.' },
            data: {
              user: {
                id: resource.id.to_s,
                email: resource.email
              }
            }
          }, status: :ok
        else
          render json: {
            status: { code: 401, message: 'Invalid email or password.' }
          }, status: :unauthorized
        end
      end
    end
  end
end

