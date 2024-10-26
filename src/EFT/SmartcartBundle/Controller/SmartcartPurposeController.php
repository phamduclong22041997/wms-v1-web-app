<?php

namespace EFT\SmartcartBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class SmartcartPurposeController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\SmartcartBundle\Biz\SmartcartPurposeBiz";
    }

    /**
     * Get list
     */
    public function getSmartcartPurposeComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getSmartcartPurposeCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
}