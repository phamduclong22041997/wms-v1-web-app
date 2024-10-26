<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\MasterDataBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\BaseController;
use OVCore\UtilityBundle\Lib\ServerResponse;

class GeoController extends BaseController
{
    protected function getBizClass()
    {
        return "\WFT\MasterDataBundle\Biz\GeoBiz";
    }

    /**
     * Get Transfer Session
     */
    public function getProvinceAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $country =  $request->query->get('country') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getProvince($country);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
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
        return realpath(__DIR__ . "/../Translations/MasterData.$locale.php");
    }
}