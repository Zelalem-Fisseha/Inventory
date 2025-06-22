class Product < ApplicationRecord
  belongs_to :user
  validates :quantity, numericality: { only_integer: true, greater_than: 0 }, presence: true
  validates :product_name, presence: true
  validates :original_price, numericality: { greater_than_or_equal_to: 0 },presence: true
  validates :delivery_fee, numericality: { greater_than_or_equal_to: 0 },presence: true
  validates :description, presence: true, length: { maximum: 200 }

  def supplier_fee
    original_price * 0.2
  end

  def cost_price
    supplier_fee + delivery_fee
  end

  def selling_price
    cost_price / (1 - target_margin / 100)
  end


end
