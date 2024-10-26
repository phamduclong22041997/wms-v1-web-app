<?php
/**
 * Copyright (c) 2020 OVTeam
 * Modified date: 2020/01/10
 * Modified by: An Truong
 */

namespace EFT\ProductBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class ProductConfigurationAttachedServiceController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\ProductBundle\Biz\ProductConfigurationAttachedServiceBiz";
    }

     //Get list service type combo
     public function getServiceTypeComboAction() 
     {
         $resp = new ServerResponse();
         $response = new Response();
         try {
             $cls = $this->getBizClass();
             $data = $cls::getServiceTypeCombo();
             $resp->setResponseData($data);
         } catch (\Exception $e) {
             $resp->addError($e->getMessage());
         }
         $response->setContent(json_encode($resp));
         return $response;
     }
 
      /**
      * Get service list by type
      */
     public function getServiceAction() 
     {
        
         $resp = new ServerResponse();
         $response = new Response();
         try {
             $cls = $this->getBizClass();
             $searchParams = $this->getQueryParams();                         
             $data = $cls::getService($searchParams['filter']['type']);
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
        return realpath(__DIR__."/../Translations/ProductConfigurationAttachedService.$locale.php");
    }
   

}