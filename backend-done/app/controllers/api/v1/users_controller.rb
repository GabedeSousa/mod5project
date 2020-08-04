class Api::V1::UsersController < ApplicationController
  

  def create
    @user = User.new(user_params)
    if @user.save
      cookies.signed[:user_id] = @user.id
      render json: {token: JWT.encode(@user, "qwertyuiopasdfghjklzxcvbnm1234567890"), id: @user.id}
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

  def get_current_user
    current_user
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :venmo, :image_url, :password)
  end


end
