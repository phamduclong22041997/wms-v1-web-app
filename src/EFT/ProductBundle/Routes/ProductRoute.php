<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/02/10
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ProductBundle\Controller\ProductController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_product_list', '/api/product/list')
            ->controller([ProductController::class, 'getListAction'])
            ->methods(['GET']);

    $routes->add('eft_product_save', '/api/product/save')
        ->controller([ProductController::class, 'saveAction'])
        ->methods(['POST']); 

    $routes->add('eft_product_checksku', '/api/product/checksku')
        ->controller([ProductController::class, 'checkSkuAction'])
        ->methods(['GET']);
};