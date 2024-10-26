<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\TransferSessionBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\BaseController;
use OVCore\UtilityBundle\Lib\ServerResponse;
use EFT\PurchaseOrderBundle\Lib\Configuration;
use WFT\TransferSessionBundle\Lib\Utils;

class TransferSessionController extends BaseController {
    protected function getBizClass()
    {
        return "\WFT\TransferSessionBundle\Biz\TransferSessionBiz";
    }

    /**
     * Get Transfer Session
     */
    public function getClientsAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $content =  $request->query->get('Content') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getClients(['Content' => $content]);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Transfer Session
     */
    public function getOneAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $TransferSessionCode =  $request->query->get('TransferSessionCode') ?? "";
            $cls = $this->getBizClass();
            $data = $cls::getOne($TransferSessionCode);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Package List from WMS
     */
    public function checkPackageAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
           $c3PL =  $request->query->get('C3PLId');
           $content =  $request->query->get('Content');
           $cls = $this->getBizClass();
           $data = $cls::getWMSPackages(['C3PL' => $c3PL, 'Content' => $content]);
           $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Product List from WMS
     */
    public function checkProductAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
           $SoCode =  $request->query->get('SoCode');
           $content =  $request->query->get('Content');
           $cls = $this->getBizClass();
           $data = $cls::getWMSProducts(['SoCode' => $SoCode, 'Content' => $content]);
           $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Package List from Transfer Session
     */
    public function getPackageAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
           $TransferSessionCode =  $request->query->get('TransferSessionCode');
           $cls = $this->getBizClass();
           $data = $cls::getTransferSessionPackages(['TransferSessionCode' => $TransferSessionCode]);
           $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Product List from Transfer Session
     */
    public function getProductAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
           $TransferSessionCode =  $request->query->get('TransferSessionCode');
           $cls = $this->getBizClass();
           $data = $cls::getTransferSessionProducts(['TransferSessionCode' => $TransferSessionCode]);
           $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Generate Transfer Session Code
     */
     public function generateSessionAction() 
     {
         $resp = new ServerResponse();
         $response = new Response();
         $request = $this->get('request_stack')->getCurrentRequest();
         try {
            $c3PL =  $request->query->get('C3PL');
            $data = Utils::generateTransferSession("TF", ['C3PL' => $c3PL], 'TransferSessionCode', 3);
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
        return realpath(__DIR__."/../Translations/TransferSession.$locale.php");
    }
}