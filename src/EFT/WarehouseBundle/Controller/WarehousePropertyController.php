<?php

namespace EFT\WarehouseBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class WarehousePropertyController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\WarehouseBundle\Biz\WarehousePropertyBiz";
    }

    /**
     * Get list
     */
    public function getWarehousePropertyComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $request = $this->get('request_stack')->getCurrentRequest();
            $requestParams = array(
                'filter'     => $request->query->get('filter') ?? null
            );
            if($requestParams['filter']) {
                $requestParams['filter'] = json_decode($requestParams['filter'], true);
            }
            $data = $cls::getWarehousePropertyCombo($requestParams);
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
    public function getWarehousePropertyTypeComboAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getWarehousePropertyTypeCombo();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
}