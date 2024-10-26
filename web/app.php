<?php
use App\Kernel;

use Symfony\Component\HttpFoundation\Request;

require __DIR__.'/../vendor/autoload.php';

if ($trustedProxies = ($_SERVER['TRUSTED_PROXIES'] ?? $_ENV['TRUSTED_PROXIES'] ?? false)) {
    Request::setTrustedProxies(explode(',', $trustedProxies), Request::HEADER_X_FORWARDED_ALL ^ Request::HEADER_X_FORWARDED_HOST);
}

if ($trustedHosts = ($_SERVER['TRUSTED_HOSTS'] ?? $_ENV['TRUSTED_HOSTS'] ?? false)) {
    Request::setTrustedHosts(explode(',', $trustedHosts));
}

$kernel = new Kernel('prod', false);
$request = Request::createFromGlobals();

if(Request::METHOD_POST == $request->getMethod() && $request->request->count() == 0) {    
    $request->request->replace(json_decode($request->getContent(), true));
}

$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);