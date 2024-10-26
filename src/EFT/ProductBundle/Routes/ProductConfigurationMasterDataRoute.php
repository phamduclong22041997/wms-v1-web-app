<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/17
 * Modified by: Pham Cuong
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\ProductBundle\Controller\ProductConfigurationMasterDataController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_product_configuration_masterdata_list', '/api/productconfigurationmasterdata/list')
            ->controller([ProductConfigurationMasterDataController::class, 'getListAction'])
            ->methods(['GET']);
        ;
    $routes->add('eft_product_configuration_masterdata_save', '/api/productconfigurationmasterdata/save')
        ->controller([ProductConfigurationMasterDataController::class, 'saveAction'])
        ->methods(['POST']); 
    
    $routes->add('eft_product_configuration_masterdata_combo', '/api/productconfigurationmasterdata/combo')
        ->controller([ProductConfigurationMasterDataController::class, 'getComboAction'])
        ->methods(['GET']); 

    $routes->add('eft_product_configuration_masterdata_type_combo', '/api/productconfigurationmasterdatatype/combo')
        ->controller([ProductConfigurationMasterDataController::class, 'getMasterDataTypeComboAction'])
        ->methods(['GET']); 

    $routes->add('eft_product_configuration_masterdata_code_combo', '/api/productconfigurationmasterdatacode/combo')
        ->controller([ProductConfigurationMasterDataController::class, 'getMasterDataCodeComboAction'])
        ->methods(['GET']); 
};