<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/10
 * Modified by: An Truong
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ProductBundle\Controller\ProductConfigurationAttachedServiceController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_product_configuration_attachedservice_list', '/api/productconfigurationattachedservice/list')
            ->controller([ProductConfigurationAttachedServiceController::class, 'getListAction'])
            ->methods(['GET']);

    $routes->add('eft_product_configuration_attachedservice_save', '/api/productconfigurationattachedservice/save')
        ->controller([ProductConfigurationAttachedServiceController::class, 'saveAction'])
        ->methods(['POST']); 
        
    $routes->add('eft_product_configuration_servicetype_combo', '/api/productconfigurationservicetype/combo')
        ->controller([ProductConfigurationAttachedServiceController::class, 'getServiceTypeComboAction'])
        ->methods(['GET']);
        
    $routes->add('eft_product_configuration_getservice', '/api/productconfigurationattachedservice/getservice')
        ->controller([ProductConfigurationAttachedServiceController::class, 'getServiceAction'])
        ->methods(['GET']);
};