json.products @products do |product|
    json.id product.id
    json.name product.name
    json.user_email product.user_email
    json.user_id product.user_id
    json.image_url product.image_url
    json.description product.description
    json.price number_to_currency(product.price)
    json.quantity product.quantity
end