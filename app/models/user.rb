class User < ApplicationRecord
  has_secure_password
  has_many :products

  validates :username, presence: true, uniqueness: true
  validates :password_digest, presence: true, length: { minimum: 8 }
end
