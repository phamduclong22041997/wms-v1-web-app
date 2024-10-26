<?php

/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use WFT\MasterDataBundle\Controller\MasterDataController;

return function (RoutingConfigurator $routes) {
        $routes->add('wft_storage_equipment', '/api/v1/storage/equipment')
                ->controller([MasterDataController::class, 'getStorageEquipmentAction'])
                ->methods(['GET']);
        $routes->add('wft_storage_checkequipment', '/api/v1/storage/checkequipment')
                ->controller([MasterDataController::class, 'checkStorageEquipmentAction'])
                ->methods(['POST']);
        $routes->add('wft_storage_updateequipment', '/api/v1/storage/updateequipment')
                ->controller([MasterDataController::class, 'updateStorageEquipmentAction'])
                ->methods(['POST']);
        $routes->add('wft_statusenum_getlist', '/api/v1/statusenum/getlist')
                ->controller([MasterDataController::class, 'getListAction'])
                ->methods(['GET']);
        $routes->add('wft_product_status', '/api/v1/product/status')
                ->controller([MasterDataController::class, 'getProductStatusAction'])
                ->methods(['GET']);
        $routes->add('wft_package_status', '/api/v1/package/status')
                ->controller([MasterDataController::class, 'getPackageStatusAction'])
                ->methods(['GET']);
        $routes->add('wft_transfersession_status', '/api/v1/transfersession/status')
                ->controller([MasterDataController::class, 'getTransferSessionStatusAction'])
                ->methods(['GET']);
        $routes->add('wft_sopool_servicetype', '/api/v1/sopool/servicetype')
                ->controller([MasterDataController::class, 'getSoPoolServiceTypeAction'])
                ->methods(['GET']);
        $routes->add('wft_sopool_status', '/api/v1/sopool/status')
                ->controller([MasterDataController::class, 'getSoPoolStatusAction'])
                ->methods(['GET']);
        $routes->add('wft_sopool_sotype', '/api/v1/sopool/sotype')
                ->controller([MasterDataController::class, 'getSoPoolSoTypeAction'])
                ->methods(['GET']);
        $routes->add('wft_province_getlist', '/api/v1/province/getlist')
                ->controller([MasterDataController::class, 'getProvinceAction'])
                ->methods(['GET']);
        $routes->add('wft_wms_employee', '/api/v1/wms/employee')
                ->controller([MasterDataController::class, 'getEmployeeAction'])
                ->methods(['GET']);
        $routes->add('wft_warehouse', '/api/v1/warehouse')
                ->controller([MasterDataController::class, 'getWarehouseAction'])
                ->methods(['GET']);
};