<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\TransferSessionBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\BaseController;
use OVCore\UtilityBundle\Lib\ServerResponse;
use EFT\PurchaseOrderBundle\Lib\Configuration;

class TransferSessionDetailController extends BaseController {
    protected function getBizClass()
    {
        return "\WFT\TransferSessionBundle\Biz\TransferSessionDetailBiz";
    }
    
    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/TransferSessionDetail.$locale.php");
    }
}