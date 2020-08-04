json.comments @comments do |comment|
    json.id comment.id
    json.user_id comment.user_id
    json.product_id comment.product_id
    json.body comment.body
    json.email comment.email
end