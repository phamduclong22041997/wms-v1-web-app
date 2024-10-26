<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ParameterBundle\Controller\OperationStatusController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_parameter_operationstatus_list', '/api/paramerteroperationstatus/list')
            ->controller([OperationStatusController::class, 'getListAction'])
            ->methods(['GET']);

    $routes->add('eft_parameter_operationstatus_save', '/api/paramerteroperationstatus/save')
        ->controller([OperationStatusController::class, 'saveAction'])
        ->methods(['POST']);

    $routes->add('eft_parameter_operation_code_combo', '/api/paramerteroperationcode/combo')
        ->controller([OperationStatusController::class, 'getCodeComboAction'])
        ->methods(['GET']);
};