<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ClientBundle\Controller\ClientTypeController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_client_type_list', '/api/clienttype/list')
            ->controller([ClientTypeController::class, 'getListAction'])
            ->methods(['GET']);
   $routes->add('eft_client_type_combo', '/api/clienttype/combo')
            ->controller([ClientTypeController::class, 'getClientTypeComboAction'])
            ->methods(['GET']);
    $routes->add('eft_client_type_save', '/api/clienttype/save')
        ->controller([ClientTypeController::class, 'saveAction'])
        ->methods(['POST']);
};