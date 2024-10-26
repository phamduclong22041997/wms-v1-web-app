<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */
namespace EFT\NetworkingBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class AddressAreaController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\NetworkingBundle\Biz\AddressAreaBiz";
    }

    /**
     * Get list
     */
    public function getAreaComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getAreaCombo();
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
        return realpath(__DIR__."/../Translations/AddressArea.$locale.php");
    }
}