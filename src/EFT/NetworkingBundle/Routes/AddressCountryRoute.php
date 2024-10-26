<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\NetworkingBundle\Controller\AddressCountryController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_networking_address_country_list', '/api/addresscountry/list')
            ->controller([AddressCountryController::class, 'getListAction'])
            ->methods(['GET']);

    $routes->add('eft_networking_address_country_save', '/api/addresscountry/save')
        ->controller([AddressCountryController::class, 'saveAction'])
        ->methods(['POST']);

    $routes->add('eft_networking_address_country_countrycombo', '/api/addresscountry/combo')
        ->controller([AddressCountryController::class, 'getCountryComboAction'])
        ->methods(['GET']);
};