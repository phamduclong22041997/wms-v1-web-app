<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/17
 * Modified by: Pham Cuong
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ProductBundle\Controller\ProductConfigurationIndustryController;

return function (RoutingConfigurator $routes) {

    $routes->add('eft_product_configuration_industry_list', '/api/productconfigurationindustry/list')
            ->controller([ProductConfigurationIndustryController::class, 'getListAction'])
            ->methods(['GET']);

    $routes->add('eft_product_configuration_industry_save', '/api/productconfigurationindustry/save')
        ->controller([ProductConfigurationIndustryController::class, 'saveAction'])
        ->methods(['POST']); 

        $routes->add('eft_product_configuration_industry_combo', '/api/productconfigurationindustry/combo')
        ->controller([ProductConfigurationIndustryController::class, 'getComboAction'])
        ->methods(['GET']);
};