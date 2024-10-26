<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/15
 * Modified by: Tri Cao
 */

namespace EFT\ReasonBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class ReasonForCancelPOController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\ReasonBundle\Biz\ReasonForCancelPOBiz";
    }

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/ReasonForCancelPO.$locale.php");
    }
}