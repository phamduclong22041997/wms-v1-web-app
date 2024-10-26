<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/02/10
 * Modified by: Tri Cao
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ParameterBundle\Controller\StatusOfOperationObjectController;

return function (RoutingConfigurator $routes) {
        $routes->add('eft_parameter_status_of_operationobject_list', '/api/parameterstatusofoperationobject/list')
                ->controller([StatusOfOperationObjectController::class, 'getListAction'])
                ->methods(['GET']);

        $routes->add('eft_parameter_status_of_operationobject_save', '/api/parameterstatusofoperationobject/save')
                ->controller([StatusOfOperationObjectController::class, 'saveAction'])
                ->methods(['POST']);
                
        $routes->add('eft_parameter_status_of_operationobject_combo', '/api/parameterstatusofoperationobject/combo')
        ->controller([StatusOfOperationObjectController::class, 'getComboAction'])
        ->methods(['GET']);
};
