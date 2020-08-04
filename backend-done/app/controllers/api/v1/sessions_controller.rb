class Api::V1::SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email].downcase)
    if user && user.authenticate(params[:password])
      cookies.signed[:user_id] = user.id
      render json: {token: JWT.encode(user, "qwertyuiopasdfghjklzxcvbnm1234567890"), id: user.id}
      # render json: {token: JWT.decode(JWT.encode(user, "1234567890"))}
    else
      render json: { error: "Invalid email/password combination" },
       status: 401
    end
  end

  def destroy
    cookies.delete :user_id
  end
end