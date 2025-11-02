module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      private

      def respond_with(resource, _opts = {})
        if resource.persisted?
          render json: {
            status: { code: 200, message: 'Signed up successfully.' },
            data: {
              user: {
                id: resource.id.to_s,
                email: resource.email
              }
            }
          }, status: :ok
        else
          render json: {
            status: { code: 422, message: 'User could not be created.' },
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end
end

