# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "🌱 Seeding database..."

# Create test user if it doesn't exist
test_email = 'test@example.com'
test_password = 'password123'

if User.where(email: test_email).exists?
  puts "✓ Test user already exists (#{test_email})"
else
  User.create!(
    email: test_email,
    password: test_password,
    password_confirmation: test_password
  )
  puts "✓ Test user created successfully!"
  puts "  Email: #{test_email}"
  puts "  Password: #{test_password}"
end

puts "🌱 Seeding complete!"

