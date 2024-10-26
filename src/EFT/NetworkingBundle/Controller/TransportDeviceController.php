<?php

namespace EFT\NetworkingBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;
use OVCore\UtilityBundle\Lib\BaseController;

class TransportDeviceController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\NetworkingBundle\Biz\TransportDeviceBiz";
    }

    /**
     * Get Combo
     */
    public function getTransportDeviceComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getTransportDeviceCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get One
     */
    public function getOneAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $request = $this->get('request_stack')->getCurrentRequest();
            $requestParams = array(
                'transportdevicecode'     => $request->query->get('transportdevicecode')
            );
            $data = $cls::getOne($requestParams);
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
    public function getTransportDeviceTypeAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getTransportDeviceType();
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
    public function getUsingStatusAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getUsingStatus();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
}