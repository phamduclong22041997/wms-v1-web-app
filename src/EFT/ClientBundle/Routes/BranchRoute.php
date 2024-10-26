<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/19
 * Modified by: Pham Cuong
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ClientBundle\Controller\BranchController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_branch_list', '/api/branch/list')
            ->controller([BranchController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_branch_save', '/api/branch/save')
        ->controller([BranchController::class, 'saveAction'])
        ->methods(['POST']);
};