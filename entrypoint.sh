#!/bin/bash

# Create directories if they don't exist
mkdir -p /var/www/storage /var/www/bootstrap/cache

# Set proper permissions only for necessary directories (suppress all errors)
chown -R instaapp:instaapp /var/www/storage 2>/dev/null || true
chown -R instaapp:instaapp /var/www/bootstrap/cache 2>/dev/null || true

# Run php-fpm
exec php-fpm
