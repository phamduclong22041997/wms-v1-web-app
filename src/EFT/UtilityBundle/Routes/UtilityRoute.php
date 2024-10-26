<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use EFT\UtilityBundle\Controller\UtilityController;

return function (RoutingConfigurator $routes) {
    $routes->add('eft_import_file', '/api/file/import')
            ->controller([UtilityController::class, 'importAction'])
            ->methods(['POST']);
    $routes->add('eft_upload_file', '/api/file/upload')
            ->controller([UtilityController::class, 'uploadAction'])
            ->methods(['POST']);
    $routes->add('eft_file_image', '/api/file/image')
            ->controller([UtilityController::class, 'getImageAction'])
            ->methods(['GET']);
};