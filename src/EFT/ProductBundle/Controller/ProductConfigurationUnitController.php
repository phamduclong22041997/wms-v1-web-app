<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/18
 * Modified by: Duy Huynh
 */

namespace EFT\ProductBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class ProductConfigurationUnitController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\ProductBundle\Biz\ProductConfigurationUnitBiz";
    }

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/ProductConfigurationUnit.$locale.php");
    }
}