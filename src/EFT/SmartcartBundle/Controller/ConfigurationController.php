<?php

namespace EFT\SmartcartBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;
use OVCore\UtilityBundle\Lib\BaseController;

class ConfigurationController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\SmartcartBundle\Biz\ConfigurationBiz";
    }

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/Configuration.$locale.php");
    }
}