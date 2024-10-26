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

class ProductConfigurationMasterDataController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\ProductBundle\Biz\ProductConfigurationMasterDataBiz";
    }

    /**
     * Get list
     */
    public function getComboAction() 
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $type = $request->query->get('type');
            $data = $cls::getCombo($type);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get list
     */
    public function getMasterDataTypeComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getMasterDataTypeCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get list
     */
    public function getMasterDataCodeComboAction() 
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $type = $request->query->get('type');
            $data = $cls::getMasterDataCodeCombo($type);
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
        return realpath(__DIR__."/../Translations/ProductConfigurationMasterData.$locale.php");
    }
}