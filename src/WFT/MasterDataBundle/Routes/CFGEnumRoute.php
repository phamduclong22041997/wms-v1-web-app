<?php

/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use WFT\MasterDataBundle\Controller\CFGEnumController;

return function (RoutingConfigurator $routes) {
        $routes->add('wft_cfg_enum_status', '/api/v1/status')
                ->controller([CFGEnumController::class, 'getStatusByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_config', '/api/v1/cfg')
                ->controller([CFGEnumController::class, 'getConfigByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_picklistmethod', '/api/v1/picklistmethod')
                ->controller([CFGEnumController::class, 'getPicklistMethodByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_biztype', '/api/v1/biztype')
                ->controller([CFGEnumController::class, 'getBizTypeByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_status_assign_storage', '/api/v1/statusassignstorage')
                ->controller([CFGEnumController::class, 'getStatusAssignStorageByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_claim_status', '/api/v1/claim/status')
                ->controller([CFGEnumController::class, 'getClaimStatusByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_claim_kind', '/api/v1/claim/kind')
                ->controller([CFGEnumController::class, 'getClaimKindByModuleAction'])
                ->methods(['GET']);
                $routes->add('wft_cfg_enum_claim_withdrawaltype', '/api/v1/claim/withdrawaltype')
                ->controller([CFGEnumController::class, 'getClaimWithdrawalTypeByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_supply_status', '/api/v1/supply/status')
                ->controller([CFGEnumController::class, 'getSupplyStatusByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_masanstore_status', '/api/v1/masanstore/status')
                ->controller([CFGEnumController::class, 'getMasanStoreStatusByModuleAction'])
                ->methods(['GET']);
        $routes->add('wft_cfg_enum_masanoffer_type', '/api/v1/masanoffer/type')
                ->controller([CFGEnumController::class, 'getMasanOfferTypeByModuleAction'])
                ->methods(['GET']);
};