<?php

namespace EFT\ParameterBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class OperationObjectController extends BaseController {

    protected function getBizClass()
    {
        return "\EFT\ParameterBundle\Biz\OperationObjectBiz";
    }

    // Get Combo Operation Object
    public function getComboAction() {
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

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/OperationObject.$locale.php");
    }
}