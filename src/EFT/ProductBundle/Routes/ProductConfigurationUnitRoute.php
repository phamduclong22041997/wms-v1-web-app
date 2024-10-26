<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/17
 * Modified by: Pham Cuong
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ProductBundle\Controller\ProductConfigurationUnitController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_product_configuration_unit_list', '/api/productconfigurationunit/list')
            ->controller([ProductConfigurationUnitController::class, 'getListAction'])
            ->methods(['GET']);
    $routes->add('eft_product_configuration_unit_save', '/api/productconfigurationunit/save')
        ->controller([ProductConfigurationUnitController::class, 'saveAction'])
        ->methods(['POST']); 
};