<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/02/07
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ClientBundle\Controller\UtilityController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_client_combo', '/api/client/combo')
        ->controller([UtilityController::class, 'getClientComboAction'])
        ->methods(['GET']);
    $routes->add('eft_currency_unit_combo', '/api/currencyunit/combo')
            ->controller([UtilityController::class, 'getCurrencyUnitComboAction'])
            ->methods(['GET']);
   $routes->add('eft_payment_term_combo', '/api/paymentterm/combo')
            ->controller([UtilityController::class, 'getPaymentTermComboAction'])
            ->methods(['GET']);
};