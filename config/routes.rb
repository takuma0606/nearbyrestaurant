Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root "restaurants#search"
  post 'index', to: 'restaurants#index'
  get 'show/:id', to: 'restaurants#show'
end
