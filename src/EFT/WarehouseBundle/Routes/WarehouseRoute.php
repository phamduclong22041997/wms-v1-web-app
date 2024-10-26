<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/01/14
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\WarehouseBundle\Controller\WarehouseController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_warehouse_combo', '/api/warehouse/combo')
        ->controller([WarehouseController::class, 'getWarehouseComboAction'])
        ->methods(['GET']);
};