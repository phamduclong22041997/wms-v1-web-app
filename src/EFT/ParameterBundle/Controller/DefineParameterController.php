<?php

namespace EFT\ParameterBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class DefineParameterController extends BaseController {

    protected function getBizClass()
    {
        return "\EFT\ParameterBundle\Biz\DefineParameterBiz";
    }

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/DefineParameter.$locale.php");
    }
}