FROM php:8.2-fpm

# Install Node.js 22
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u 1000 -d /home/instaapp instaapp
RUN mkdir -p /home/instaapp/.composer && \
    chown -R instaapp:instaapp /home/instaapp

# Set working directory
WORKDIR /var/www

# Copy entrypoint script
COPY --chown=instaapp:instaapp entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER instaapp

ENTRYPOINT ["/entrypoint.sh"]
