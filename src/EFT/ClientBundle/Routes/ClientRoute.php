<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/17
 * Modified by: Pham Cuong
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ClientBundle\Controller\ClientController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_client_list', '/api/client/list')
            ->controller([ClientController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_client_save', '/api/client/save')
        ->controller([ClientController::class, 'saveAction'])
        ->methods(['POST']);

    $routes->add('eft_client_one', '/api/client/one')
        ->controller([ClientController::class, 'getOneAction'])
        ->methods(['GET']);
};