if current_user
    json.current_user do
        json.id current_user.id
        json.email current_user.email
        json.fullname current_user.fullname
    end
end