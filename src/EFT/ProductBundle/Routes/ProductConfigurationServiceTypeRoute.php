<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/02/17
 * Modified by: Huy Nghiem
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ProductBundle\Controller\ProductConfigurationServiceTypeController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_product_configuration_servicetype_list', '/api/productconfigurationservicetype/list')
            ->controller([ProductConfigurationServiceTypeController::class, 'getListAction'])
            ->methods(['GET']);
    $routes->add('eft_product_configuration_servicetype_save', '/api/productconfigurationservicetype/save')
        ->controller([ProductConfigurationServiceTypeController::class, 'saveAction'])
        ->methods(['POST']); 
};