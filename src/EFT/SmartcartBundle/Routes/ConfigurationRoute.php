<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\SmartcartBundle\Controller\ConfigurationController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_smartcart_configuration_list', '/api/smartcartconfiguration/list')
            ->controller([ConfigurationController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_smartcart_configuration_save', '/api/smartcartconfiguration/save')
        ->controller([ConfigurationController::class, 'saveAction'])
        ->methods(['POST']);
};