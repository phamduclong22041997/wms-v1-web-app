<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use WFT\C3PLBundle\Controller\C3PLController;

return function (RoutingConfigurator $routes) {
    $routes->add('wft_c3pl_combo', '/api/v1/c3pl/combo')
            ->controller([C3PLController::class, 'getComboAction'])
            ->methods(['GET']);
};