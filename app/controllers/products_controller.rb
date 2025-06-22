class ProductsController < ApplicationController

    before_action :set_product, only: [:show, :update, :destroy]

    def index
      @products = Product.all
      render json: @products.as_json(methods: [:supplier_fee, :cost_price, :selling_price])
    end

    def show
      render json: @product.as_json(methods: [:supplier_fee, :cost_price, :selling_price])
    end

    def create
      @product = Product.new(product_params)

      if @product.save
        render json: @product.as_json(methods: [:supplier_fee, :cost_price, :selling_price]), status: :created
      else
        render json: { errors: @product.errors.full_messages }, status: :unprocessable_content
      end
    end


    def update
      if @product.update(product_params)
        render json: @product.as_json(methods: [:supplier_fee, :cost_price, :selling_price])
      else
        render json: { errors: @product.errors.full_messages }, status: :unprocessable_content
      end
    end


    def destroy
      @product.destroy
      head :no_content
    end

    private

    def set_product
      @product = Product.find(params[:id])
    end

    def product_params
      params.require(:product).permit(:product_name, :description, :original_price, :quantity, :delivery_fee,:target_margin,:user_id)
    end
end
