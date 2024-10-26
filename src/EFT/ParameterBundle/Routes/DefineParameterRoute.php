<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/02/11
 * Modified by: An Truong
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ParameterBundle\Controller\DefineParameterController;

return function (RoutingConfigurator $routes) {
        $routes->add('eft_parameter_defineparameter_list', '/api/parameterdefineparameter/list')
        ->controller([DefineParameterController::class, 'getListAction'])
        ->methods(['GET']);

    $routes->add('eft_parameter_defineparameter_save', '/api/parameterdefineparameter/save')
        ->controller([DefineParameterController::class, 'saveAction'])
        ->methods(['POST']);
};
