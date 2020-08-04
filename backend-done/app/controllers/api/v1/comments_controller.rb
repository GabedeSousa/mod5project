class Api::V1::CommentsController < ApplicationController
	# before_action :find_comments, only: [:show, :edit, :update, :destroy]
  before_action :require_signin

    def index
        @comments = Comment.where(product_id: params[:id]).order(created_at: :DESC)
    end

    def create
      @comment = Comment.new(comment_params)
      @comment.save
      render json: @comment
    end

    def comment_params
      params.require(:comment).permit(
        :user_id, :product_id, :body
      )
    end
end
