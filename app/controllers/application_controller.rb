class ApplicationController < ActionController::API
  def preflight
    head :ok
  end
end
