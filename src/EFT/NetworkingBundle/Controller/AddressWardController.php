<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\NetworkingBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class AddressWardController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\NetworkingBundle\Biz\AddressWardBiz";
    }

    /**
     * Get list
     */
    public function getWardComboAction() 
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = [
                'country'   => $request->query->get('country'),
                'region'    => $request->query->get('region'),
                'province'  => $request->query->get('province'),
                'city'      => $request->query->get('city'),
                'district'  => $request->query->get('district'),
            ];
            $data = $cls::getWardCombo($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
}