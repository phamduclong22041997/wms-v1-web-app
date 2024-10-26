<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/14
 * Modified by: Tri Cao
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ProductBundle\Controller\ProductConfigurationUnitTypeController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_product_configuration_unit_type_list', '/api/productconfigurationunittype/list')
            ->controller([ProductConfigurationUnitTypeController::class, 'getListAction'])
            ->methods(['GET']);
    $routes->add('eft_product_configuration_unit_type_save', '/api/productconfigurationunittype/save')
        ->controller([ProductConfigurationUnitTypeController::class, 'saveAction'])
        ->methods(['POST']); 
};