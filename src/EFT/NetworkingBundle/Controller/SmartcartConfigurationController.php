<?php

namespace EFT\NetworkingBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;
use OVCore\UtilityBundle\Lib\BaseController;

class SmartcartConfigurationController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\NetworkingBundle\Biz\SmartcartConfigurationBiz";
    }
}