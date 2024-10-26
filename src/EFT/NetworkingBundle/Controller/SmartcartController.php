<?php

namespace EFT\NetworkingBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;
use OVCore\UtilityBundle\Lib\BaseController;

class SmartcartController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\NetworkingBundle\Biz\SmartcartBiz";
    }

    public function getBinInfoAction(){
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $request = $this->get('request_stack')->getCurrentRequest();
            $requestParams = array(
                'bincode'     => $request->query->get('bincode')
            );
            $data = $cls::getBinInfo($requestParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function getTransportDevicesAction(){
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $request = $this->get('request_stack')->getCurrentRequest();
            $requestParams = array(
                'smartcartcode'     => $request->query->get('smartcartcode')
            );
            $data = $cls::getTransportDevices($requestParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function getProductsizeComboAction(){
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getProductsizeCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function getConfigComboAction(){
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getConfigCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function getComboAction(){
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function getPurposeComboAction(){
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getPurposeCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function getConfigureInfoAction(){
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $request = $this->get('request_stack')->getCurrentRequest();
            $requestParams = array(
                'configurationcode'     => $request->query->get('configurationcode')
            );
            $data = $cls::getConfigureInfo($requestParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
}