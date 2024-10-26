<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh, Huy Nghiem
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use WFT\TransferSessionBundle\Controller\TransferSessionController;
use WFT\TransferSessionBundle\Controller\TransferSessionDetailController;

return function (RoutingConfigurator $routes) {
    $routes->add('wft_transfersession_list', '/api/v1/transfersession')
        ->controller([TransferSessionController::class, 'getListAction'])
        ->methods(['GET']);

    $routes->add('wft_transfersession_getone', '/api/v1/transfersession/getone')
        ->controller([TransferSessionController::class, 'getOneAction'])
        ->methods(['GET']);

    $routes->add('wft_transfersession_create', '/api/v1/transfersession')
        ->controller([TransferSessionController::class, 'saveAction'])
        ->methods(['POST']);

    $routes->add('wft_transfersession_update', '/api/v1/transfersession')
        ->controller([TransferSessionController::class, 'saveAction'])
        ->methods(['PUT']);

    $routes->add('wft_transfersession_session', '/api/v1/transfersession/generatesession')
        ->controller([TransferSessionController::class, 'generateSessionAction'])
        ->methods(['GET']);

    $routes->add('wft_transfersession_checkpackage', '/api/v1/checkpackage')
        ->controller([TransferSessionController::class, 'checkPackageAction'])
        ->methods(['GET']);
    
    $routes->add('wft_transfersession_checkproduct', '/api/v1/checkproduct')
        ->controller([TransferSessionController::class, 'checkProductAction'])
        ->methods(['GET']);
    
    $routes->add('wft_transfersession_getpackage', '/api/v1/transfersession/getpackage')
        ->controller([TransferSessionController::class, 'getPackageAction'])
        ->methods(['GET']);

    $routes->add('wft_transfersession_getproduct', '/api/v1/transfersession/getproduct')
        ->controller([TransferSessionController::class, 'getProductAction'])
        ->methods(['GET']);

    $routes->add('wft_transfersession_getclients', '/api/v1/transfersession/clients')
        ->controller([TransferSessionController::class, 'getClientsAction'])
        ->methods(['GET']);
};