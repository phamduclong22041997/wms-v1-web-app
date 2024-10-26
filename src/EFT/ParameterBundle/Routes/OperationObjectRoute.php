<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/30
 * Modified by: Tri Cao
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ParameterBundle\Controller\OperationObjectController;

return function (RoutingConfigurator $routes) {
        $routes->add('eft_parameter_operationobject_list', '/api/paramerteroperationobject/list')
                ->controller([OperationObjectController::class, 'getListAction'])
                ->methods(['GET']);

        $routes->add('eft_parameter_operationobject_save', '/api/paramerteroperationobject/save')
                ->controller([OperationObjectController::class, 'saveAction'])
                ->methods(['POST']);

        $routes->add('eft_parameter_operationobject_combo', '/api/paramerteroperationobject/combo')
                ->controller([OperationObjectController::class, 'getComboAction'])
                ->methods(['GET']);
};
