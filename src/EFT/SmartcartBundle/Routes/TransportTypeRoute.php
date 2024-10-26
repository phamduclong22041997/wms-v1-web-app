<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\SmartcartBundle\Controller\TransportTypeController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_transport_type_list', '/api/transporttype/list')
            ->controller([TransportTypeController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_transport_type_save', '/api/transporttype/save')
        ->controller([TransportTypeController::class, 'saveAction'])
        ->methods(['POST']);
};