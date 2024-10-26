<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\WarehouseBundle\Controller\WarehousePropertyController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_warehouse_property_list', '/api/warehouseproperty/list')
            ->controller([WarehousePropertyController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_warehouse_property_save', '/api/warehouseproperty/save')
        ->controller([WarehousePropertyController::class, 'saveAction'])
        ->methods(['POST']);

    $routes->add('eft_warehouse_property_type_combo', '/api/warehousepropertytype/combo')
        ->controller([WarehousePropertyController::class, 'getWarehousePropertyTypeComboAction'])
        ->methods(['GET']);

    $routes->add('eft_warehouse_property_combo', '/api/warehouseproperty/combo')
        ->controller([WarehousePropertyController::class, 'getWarehousePropertyComboAction'])
        ->methods(['GET']);
};