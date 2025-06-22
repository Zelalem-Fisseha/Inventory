class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :product_name
      t.string :description
      t.integer :original_price
      t.integer :quantity
      t.integer :delivery_fee
      t.references :user, null: false, foreign_key: true
      t.integer :target_margin , default: 0.25


      t.timestamps
    end
  end
end
