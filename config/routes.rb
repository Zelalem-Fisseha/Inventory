Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  post "/login", to: "sessions#create", as: :sessions_create
  delete "logout" => "sessions#destroy", as: :sessions_destroy
  get "/me", to: "sessions#me", as: :sessions_me
  # Defines the root path route ("/")
  # root "posts#index"
  resources :users, only: [:create]
  resources :products

  # Allow CORS preflight requests for any path
  match '*path', to: 'application#preflight', via: :options

end
