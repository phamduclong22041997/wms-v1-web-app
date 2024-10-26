<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/17
 * Modified by: Pham Cuong
 */

namespace EFT\ClientBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class ClientController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\ClientBundle\Biz\ClientBiz";
    }
}