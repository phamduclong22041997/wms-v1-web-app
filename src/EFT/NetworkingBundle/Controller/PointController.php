<?php

namespace EFT\NetworkingBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;
use OVCore\UtilityBundle\Lib\BaseController;

class PointController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\NetworkingBundle\Biz\PointBiz";
    }

    /**
     * Get list
     */
    public function getPointTypeAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getPointType();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

}