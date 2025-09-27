#!/bin/bash

# Deployment script for Student Portal Frontend
# Run this on your server

echo "🚀 Starting deployment..."

# Build the production version
echo "📦 Building production files..."
npm install
npm run build

# Create deployment directory
echo "📁 Creating deployment directory..."
sudo mkdir -p /var/www/student-portal

# Copy build files
echo "📋 Copying build files..."
sudo cp -r dist/* /var/www/student-portal/

# Set permissions
echo "🔒 Setting permissions..."
sudo chown -R www-data:www-data /var/www/student-portal
sudo chmod -R 755 /var/www/student-portal

# Copy nginx configuration
echo "⚙️ Configuring nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/student-portal
sudo ln -sf /etc/nginx/sites-available/student-portal /etc/nginx/sites-enabled/
sudo nginx -t

# Restart nginx
echo "🔄 Restarting nginx..."
sudo systemctl restart nginx

echo "✅ Deployment complete!"
echo "🌐 Your portal is now accessible at http://your-domain.com"
echo "📝 Remember to update the domain in nginx.conf"