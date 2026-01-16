#!/bin/bash
set -e

# Run as root to fix permissions and create symlink
su - root -c "
    # Ensure storage directory has correct permissions
    chown -R www-data:www-data /var/www/storage
    chmod -R 775 /var/www/storage

    # Remove old symlink if exists
    rm -f /var/www/public/storage

    # Create symlink using relative path to work in Docker
    cd /var/www/public
    ln -s ../storage/app/public storage
"

# Continue with PHP-FPM
exec php-fpm
