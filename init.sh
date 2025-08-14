#!/bin/bash

echo "Starting initialization script..."
set -euo pipefail
cd /var/www/html

echo "Copying application files..."

# If ./vendor is not exists, copy from /tmp/app/vendor
if [ ! -d "./vendor" ]; then
    echo "Vendor directory does not exist, copying from /tmp/app/vendor..."
    cp -r /tmp/app/vendor ./
    # rm -rf ./vendor
fi

if [ ! -d "./node_modules" ]; then
    echo "Node modules directory does not exist, copying from /tmp/app/node_modules..."
    cp -r /tmp/app/node_modules ./
    # rm -rf ./node_modules
fi

composer install
npm install

echo "Fix file permissions..."
chmod -R 777 ./storage

php artisan storage:link

echo "Migrating database..."
php artisan migrate --force

echo "Start dev server..."
pm2 start "npm run dev" --name "dev-server" --no-autorestart


echo "Starting..."
/usr/local/bin/apache2-foreground
