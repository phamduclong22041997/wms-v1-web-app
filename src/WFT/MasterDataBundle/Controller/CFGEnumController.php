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

class CFGEnumController extends BaseController
{
    protected function getBizClass()
    {
        return "\WFT\MasterDataBundle\Biz\CFGEnumBiz";
    }

    /**
     * Get Status By Module
     */
    public function getStatusByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getStatusByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Claim Status By Module
     */
    public function getClaimStatusByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getClaimStatusByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Supply Status By Module
     */
    public function getSupplyStatusByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getSupplyStatusByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

     /**
     * Get Masan Store Status By Module
     */
    public function getMasanStoreStatusByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getMasanStoreStatusByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

      /**
     * Get Masan Offer Type By Module
     */
    public function getMasanOfferTypeByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getMasanOfferTypeByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

     /**
     * Get Claim Kind By Module
     */
    public function getClaimKindByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getClaimKindByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

     /**
     * Get Claim Withdrawal Type By Module
     */
    public function getClaimWithDrawalTypeByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getClaimWithDrawalTypeByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Status Assign Storage By Module
     */
    public function getStatusAssignStorageByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getStatusAssignStorageByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get BizType By Module
     */
    public function getBizTypeByModuleAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getBizTypeByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Picklist Method By Module
     */
    public function getPicklistMethodByModuleAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $module =  $request->query->get('module') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getPicklistMethodByModule($module);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Config By Module
     */
     public function getConfigByModuleAction() 
     {
         $resp = new ServerResponse();
         $response = new Response();
         $request = $this->get('request_stack')->getCurrentRequest();
         try {
             $module =  $request->query->get('module') ?? "";
             $cls = $this->getBizClass();
             $data = $cls::getConfigByModule($module);
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