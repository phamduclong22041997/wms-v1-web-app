<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/15
 * Modified by: Tri Cao
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ReasonBundle\Controller\ReasonForCancelPOController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_reason_for_cancel_po_list', '/api/reasonforcancelpo/list')
            ->controller([ReasonForCancelPOController::class, 'getListAction'])
            ->methods(['GET']);
    $routes->add('eft_reason_for_cancel_po_save', '/api/reasonforcancelpo/save')
        ->controller([ReasonForCancelPOController::class, 'saveAction'])
        ->methods(['POST']); 
};