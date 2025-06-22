class SessionsController < ApplicationController
  def create
    user = User.find_by(username: params[:username])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json:{message: "Welcome back, #{user.username}"},status: :ok
    else
      render json:{message: "Username or password incorrect"},status: :unauthorized
    end
  end


  def destroy
    session[:user_id]=nil
    render json: {message: "Log out"},status: :ok
  end

  def me
    user=User.find_by(id: session[:user_id])
    if user
      render json: user
    else
      render json:  {error:"Not logged in"},status: :unauthorized
    end
  end
end
