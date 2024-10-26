<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\NetworkingBundle\Controller\AddressAreaController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_networking_address_area_list', '/api/addressarea/list')
            ->controller([AddressAreaController::class, 'getListAction'])
            ->methods(['GET']);

    $routes->add('eft_networking_address_area_save', '/api/addressarea/save')
        ->controller([AddressAreaController::class, 'saveAction'])
        ->methods(['POST']);

    $routes->add('eft_networking_address_area_combo', '/api/addressarea/combo')
        ->controller([AddressAreaController::class, 'getAreaComboAction'])
        ->methods(['GET']);
};