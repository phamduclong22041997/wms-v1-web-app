<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 01/26/2020
 * Modified by: An Truong
 */
namespace EFT\SmartcartBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class SourceOfMovingOrderController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\SmartcartBundle\Biz\SourceOfMovingOrderBiz";
    }

    /**
     * Get list
     */
    public function getSourceOfMovingOrderComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getSourceOfMovingOrderCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
}