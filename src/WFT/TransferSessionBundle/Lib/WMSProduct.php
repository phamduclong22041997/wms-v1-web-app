<?php

/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\TransferSessionBundle\Lib;

use OVCore\SecurityBundle\Lib\SecurityManager;
use OVCore\UtilityBundle\Lib\Utility;

class WMSProduct
{
    public static function getProducts($data)
    {
        $requestParams = [
            "SoCode"   => $data['SoCode'],
            "Code"     => $data['Content']
        ];
        $resp = [];
        $result = Utils::callWMSOPSRequest("/api/v0.1/SO/GetProductBySoWithBarcodeOrSerialNo", $requestParams);
        if ($result) {
            if ($result['HasError'] == false && $result['Result']) {
                $resp = $result['Result'];
            }
        }
        return $resp;
    }
}
