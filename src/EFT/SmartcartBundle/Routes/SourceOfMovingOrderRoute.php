<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 01/26/2020
 * Modified by: An Truong
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\SmartcartBundle\Controller\SourceOfMovingOrderController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_sourceofmovingorder_getlist', '/api/sourceofmovingorder/list')
            ->controller([SourceOfMovingOrderController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_sourceofmovingorder_save', '/api/sourceofmovingorder/save')
        ->controller([SourceOfMovingOrderController::class, 'saveAction'])
        ->methods(['POST']);
};