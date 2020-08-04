class Api::V1::ProductsController < ApplicationController
  before_action :require_signin, except: [:index]
  before_action :find_products, only: [:show, :edit, :update, :destroy]
  # before_action :require_owner, only: [:edit, :update, :destroy]

    def index
        @products = Product.all
    end

    def show
      @comment = @product.comments.build
      @comments = @product.comments
    end

    def create
      @product = Product.new(product_params)
      # @product.user = current_user
      unless @product.save
        render json: @product
      end
    end

    def update
      if @product &&  @product.update(product_params)
        render json: @product
      end
    end
 
    def destroy
      Product.find(params[:id]).destroy
      render json: params[:id]
    end

    private

    def require_owner
      unless @product.owned_by?(current_user)
        render json: { error: "Access denied!" }, status: 403
      end
    end

    def find_products
      begin
       @product = Product.find_by_id(params[:product][:id])
      rescue ActiveRecord::RecordNotFound
       render json: {
         error: "The product you are looking for is sold out!"
       }, status: 404
      end
    end

    def product_params
      params.require(:product).permit(
        :name, :price, :description, :image_url, :quantity, :user_email, :user_id
      )
    end
end
