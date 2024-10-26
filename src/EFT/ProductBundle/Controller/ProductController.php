<?php
/**
 * Copyright (c) 2020 OVTeam
 * Modified date: 2020/02/07
 * Modified by: Bang Doan
 */

namespace EFT\ProductBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class ProductController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\ProductBundle\Biz\ProductBiz";
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
                throw new \Exception("Vui lòng nhập đầy đủ thông tin");
            }
           
            $cls = '\EFT\ProductBundle\Queue\ProductQueue';           
            $result = $cls::saveProductQueue($data);
            $resp->setResponseData($result);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

     /**
     * Get list
     */
    public function checkSkuAction() 
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $sku = $request->query->get('sku');
            if(!isset($sku) || empty($sku)){
                throw new \Exception("Vui lòng nhập SKU");
            }
            
            $data = $cls::checkSku($sku);
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
        return realpath(__DIR__."/../Translations/Product.$locale.php");
    }
}