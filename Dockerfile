FROM php:8.2-apache AS base

RUN apt-get update && apt-get install -y curl wget git zip libbz2-dev sudo unzip libreadline-dev libpng-dev libmcrypt-dev libzip-dev libicu-dev libxml2-dev libgd-dev libexif-dev libonig-dev

RUN curl https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

RUN wget https://getcomposer.org/installer \
    && php ./installer && rm installer \
    && mv composer.phar /usr/local/bin/composer

RUN docker-php-ext-install pdo pdo_mysql bcmath zip intl xml gd exif opcache

RUN pecl install xdebug-3.2.1 \
	&& docker-php-ext-enable xdebug

## Install system deps for ImageMagick and build tools
#RUN apt-get update && apt-get install -y --no-install-recommends \
#    libmagickwand-dev \
#    libmagickcore-dev \
#    imagemagick \
#    pkg-config \
#    && rm -rf /var/lib/apt/lists/*
#
## Install imagick via PECL, then enable it
#RUN pecl install imagick \
#    && docker-php-ext-enable imagick
#
#RUN apt-get update && apt-get install -y ghostscript

FROM base AS runner

ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN a2enmod rewrite headers

WORKDIR /tmp/app

COPY composer.json composer.lock ./

RUN composer install --no-scripts --no-interaction

COPY package.json package-lock.json ./

RUN node --version
RUN which npm
RUN npm install pm2 -g
RUN npm install

COPY xdebug.ini php.ini /usr/local/etc/php/conf.d/

WORKDIR /var/www/html

COPY . .

EXPOSE 80
EXPOSE 443

CMD ["/var/www/html/init.sh"]
