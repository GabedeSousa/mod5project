class CreateProducts < ActiveRecord::Migration[6.0]
  def change
    create_table :products do |t|
      t.string :name
      t.string :user_email
      t.text :description
      t.decimal :price, precision: 8, scale: 2
      t.string :image_url
      t.timestamps
    end
  end
end
