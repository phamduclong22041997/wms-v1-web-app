<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Debug\Debug;
use App\Kernel;
require __DIR__.'/../../vendor/autoload.php';

// If you don't want to setup permissions the proper way, just uncomment the following PHP line
// read http://symfony.com/doc/current/book/installation.html#checking-symfony-application-configuration-and-setup
// for more information
//umask(0000);

// This check prevents access to debug front controllers that are deployed by accident to production servers.
// Feel free to remove this, extend it, or make something more sophisticated.
if (isset($_SERVER['HTTP_CLIENT_IP'])
    || isset($_SERVER['HTTP_X_FORWARDED_FOR'])
    || !(in_array(@$_SERVER['REMOTE_ADDR'], ['127.0.0.1', 'fe80::1', '::1']) || php_sapi_name() === 'cli-server')
) {
    header('HTTP/1.0 403 Forbidden');
    exit('You are not allowed to access this file. Check '.basename(__FILE__).' for more information.');
}

/**
 * @var Composer\Autoload\ClassLoader $loader
 */

umask(0000);
Debug::enable();

$kernel = new Kernel('dev', true);
// $kernel->loadClassCache();
$request = Request::createFromGlobals();

//Fix for header request
//contentType=application/json
if(Request::METHOD_POST == $request->getMethod() && $request->request->count() == 0) {    
    $request->request->replace(json_decode($request->getContent(), true));
}

set_error_handler(function(){});

$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
