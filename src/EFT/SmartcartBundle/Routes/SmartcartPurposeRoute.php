<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\SmartcartBundle\Controller\SmartcartPurposeController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_smartcart_purpose_list', '/api/smartcartpurpose/list')
            ->controller([SmartcartPurposeController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_smartcart_purpose_save', '/api/smartcartpurpose/save')
        ->controller([SmartcartPurposeController::class, 'saveAction'])
        ->methods(['POST']);
};