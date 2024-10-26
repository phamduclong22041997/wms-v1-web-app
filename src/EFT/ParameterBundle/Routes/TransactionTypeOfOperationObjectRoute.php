<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/30
 * Modified by: Tri Cao
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ParameterBundle\Controller\TransactionTypeOfOperationObjectController;

return function (RoutingConfigurator $routes) {
        $routes->add('eft_parameter_transaction_typeof_operationobject_list', '/api/parametertransactiontypeofoperationobject/list')
                ->controller([TransactionTypeOfOperationObjectController::class, 'getListAction'])
                ->methods(['GET']);

        $routes->add('eft_parameter_transaction_typeof_operationobject_save', '/api/parametertransactiontypeofoperationobject/save')
                ->controller([TransactionTypeOfOperationObjectController::class, 'saveAction'])
                ->methods(['POST']);
        $routes->add('eft_parameter_transaction_typeof_operationobject_combo', '/api/parametertransactiontypeofoperationobject/combo')
                ->controller([TransactionTypeOfOperationObjectController::class, 'getComboAction'])
                ->methods(['GET']);
};
