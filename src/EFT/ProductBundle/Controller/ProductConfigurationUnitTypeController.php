<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/14
 * Modified by: Tri Cao
 */

namespace EFT\ProductBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class ProductConfigurationUnitTypeController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\ProductBundle\Biz\ProductConfigurationUnitTypeBiz";
    }

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/ProductConfigurationUnitType.$locale.php");
    }
}