FROM node:14-alpine as builder

WORKDIR /tmpbuilder

ADD app app
ADD config config
ADD src src
ADD vendor vendor
ADD web web
ADD composer.json composer.json

RUN apk add composer --no-cache \
    && composer dumpautoload

RUN cd app \
    && npm install \
    && npm run build:$ENV
RUN rm -rf web app



FROM registry-supra.winmart.vn/lib/php-7.4-fpm-nginx-alpine:07082024

WORKDIR /app

COPY --chown=www-data:www-data --from=builder /tmpbuilder /app
ADD nginx-php/nginx/nginx.conf /etc/nginx/nginx.conf
ADD nginx-php/nginx/fastcgi.conf /etc/nginx/fastcgi.conf
ADD nginx-php/nginx/site.conf /etc/nginx/conf.d/default.conf

ADD nginx-php/php/php.ini /usr/local/etc/php/php.ini
ADD nginx-php/php/php-fpm.conf /usr/local/etc/php-fpm.conf
ADD nginx-php/php/www.conf /usr/local/etc/php-fpm.d/www.conf


RUN mkdir /app/var \
    && chown -R www-data:www-data /app/var