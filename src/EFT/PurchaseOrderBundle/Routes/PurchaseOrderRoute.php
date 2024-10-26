<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/01/14
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\PurchaseOrderBundle\Controller\PurchaseOrderController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_po_list', '/api/po/list')
            ->controller([PurchaseOrderController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_po_save', '/api/po/save')
        ->controller([PurchaseOrderController::class, 'saveAction'])
        ->methods(['POST']);

    $routes->add('eft_po_update', '/api/po/update')
        ->controller([PurchaseOrderController::class, 'updateAction'])
        ->methods(['POST']);
    
};