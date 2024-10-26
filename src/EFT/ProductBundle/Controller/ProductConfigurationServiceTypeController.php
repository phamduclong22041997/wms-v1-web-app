<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/02/17
 * Modified by: Huy Nghiem
 */

namespace EFT\ProductBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class ProductConfigurationServiceTypeController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\ProductBundle\Biz\ProductConfigurationServiceTypeBiz";
    }

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/ProductConfigurationServiceType.$locale.php");
    }
}