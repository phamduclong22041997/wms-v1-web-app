<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ParameterBundle\Controller\OperationTransactionController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_parameter_operationtransaction_list', '/api/paramerteroperationtransaction/list')
            ->controller([OperationTransactionController::class, 'getListAction'])
            ->methods(['GET']);

    $routes->add('eft_parameter_operationtransaction_save', '/api/paramerteroperationtransaction/save')
        ->controller([OperationTransactionController::class, 'saveAction'])
        ->methods(['POST']);

    $routes->add('eft_po_transactiontype_combo', '/api/po/transactiontype/combo')
        ->controller([OperationTransactionController::class, 'getPOTransactionTypeComboAction'])
        ->methods(['GET']);
};