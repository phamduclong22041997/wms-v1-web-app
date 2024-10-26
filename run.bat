SET PATH=F:\php;%PATH%
php -r opcache_reset();

php bin/console server:run --docroot="app\dist" --router="app/dist/app_router_dev.php"