<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\C3PLBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\BaseController;
use OVCore\UtilityBundle\Lib\ServerResponse;
use EFT\PurchaseOrderBundle\Lib\Configuration;

class C3PLController extends BaseController {
    protected function getBizClass()
    {
        return "\WFT\C3PLBundle\Biz\C3PLBiz";
    }

    /**
     * Get list
     */
    public function getComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getComboData();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
    
    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/C3PL.$locale.php");
    }
}