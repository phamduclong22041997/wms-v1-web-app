<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\TransferSessionBundle\Lib;

use OVCore\SecurityBundle\Lib\SecurityManager;
use OVCore\UtilityBundle\Lib\Utility;

class WMSPackage
{
    public static function getPackages($data)
    {
        $requestParams = [
            "Code"     => $data['Content'],
            "C3PLId"   => $data['C3PL']
        ];
        $resp = [];
        $result = Utils::callWMSOPSRequest("/api/v0.1/SO/GetClientSoByTransferSession", $requestParams);
        if ($result) {
            if ($result['HasError'] == false && $result['SODeliveryPackages']) {
                foreach ($result['SODeliveryPackages'] as $packageDetail) {
                    if ($packageDetail['C3PLId'] != $data['C3PL']) {
                        return $resp;
                    }
                    $resp[] = [
                        'PackageNo'     => $packageDetail['PackageNo'] ?? "",
                        'EtonCode'      => $result['EtonCode'] ?? "",
                        'ClientName'    => $packageDetail['ClientName'] ?? "",
                        'ExternalCode'  => $result['ExternalCode'] ?? "",
                        'TrackingCode'  => $packageDetail['TrackingCode'] ?? "",
                        'StatusText'    => Utility::$translator->trans("package.status." . $packageDetail['Status']),
                        'PackageNote'   => $packageDetail['LatestNote']
                    ];
                }
            }
        }
        return $resp;
    }
}