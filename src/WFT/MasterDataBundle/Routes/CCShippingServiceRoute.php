<?php

/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use WFT\MasterDataBundle\Controller\CCShippingServiceController;

return function (RoutingConfigurator $routes) {
        $routes->add('wft_cc_shippingservice', '/api/v1/shippingservice')
                ->controller([CCShippingServiceController::class, 'getShippingServiceAction'])
                ->methods(['GET']);
};