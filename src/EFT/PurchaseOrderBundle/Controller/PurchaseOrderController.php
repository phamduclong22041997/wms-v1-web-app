<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/14
 * Modified by: Duy Huynh
 */

namespace EFT\PurchaseOrderBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\BaseController;
use OVCore\UtilityBundle\Lib\ServerResponse;
use EFT\PurchaseOrderBundle\Lib\Configuration;

class PurchaseOrderController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\PurchaseOrderBundle\Biz\PurchaseOrderBiz";
    }

    private function getQueueClass()
    {
        return '\EFT\PurchaseOrderBundle\Queue\PurchaseOrderQueue';;
    }

    /**
     * Get list
     */
    public function getPOTypeComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getPOTypeCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
    /**
     * Action queue
     */
    public function saveAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $request = $this->get('request_stack')->getCurrentRequest();
            $jsonContent = $request->getContent();
            $decodedRequest = json_decode($jsonContent, true);
            $data = $decodedRequest['data'] ?? array();          
            if(!isset($data) || empty($data)){
                throw new \Exception("mess.require.params");
            }

            $cls    = (Configuration::USE_ACTION_QUEUE) ? self::getQueueClass() : $this->getBizClass();
            $result = (Configuration::USE_ACTION_QUEUE) ? $cls::createPOQueue($data) : $cls::save($data);
            
            $resp->setResponseData($result);
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
        return realpath(__DIR__."/../Translations/PurchaseOrder.$locale.php");
    }
}