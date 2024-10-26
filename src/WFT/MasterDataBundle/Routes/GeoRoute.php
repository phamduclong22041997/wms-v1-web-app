<?php

/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use WFT\MasterDataBundle\Controller\GeoController;

return function (RoutingConfigurator $routes) {
        $routes->add('wft_geo_province', '/api/v1/geo/province')
                ->controller([GeoController::class, 'getProvinceAction'])
                ->methods(['GET']);
};