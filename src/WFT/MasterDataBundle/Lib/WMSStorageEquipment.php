<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\MasterDataBundle\Lib;

use WFT\UtilityBundle\Lib\Utils;

class WMSStorageEquipment
{
    public static function getStorageEquipment()
    {
        $resp = [];
        $requestParams = [
            'Type' => 1, 'StatusList' => 1, 'PageIndex' => 1, 'RecordsPerPage' => 100
        ];
        $result = Utils::callWMSOPSRequest('/api/v0.1/Transport/SearchTransport', $requestParams);

        if ($result) {
            if ($result['HasError'] == false && $result['Result']) {
                foreach ($result['Result'] as $obj) {
                    $resp[] = [
                        'Id'            => $obj['Id'],
                        'Code'          => $obj['EtonCode'],
                        'Status'        => $obj['Status'],
                        'StatusName'    => $obj['StatusName']
                    ];
                }
            }
        }
        return $resp;
    }

    public static function checkStorageEquipment($content)
    {
        $resp = [];
        $requestParams = [
            'Type' => 1, 
            'Content' => $content['Content'],
            'PageIndex' => 1, 
            'RecordsPerPage' => 1
        ];
        $result = Utils::callWMSOPSRequest('/api/v0.1/Transport/SearchTransport', $requestParams);
        if ($result) {
            if ($result['HasError'] == false && $result['Result']) {
                foreach ($result['Result'] as $obj) {
                    $resp[] = [
                        'Id'            => $obj['Id'],
                        'Code'          => $obj['EtonCode'],
                        'Status'        => $obj['Status'],
                        'StatusName'    => $obj['StatusName']
                    ];
                }
            }
        }
        return $resp;
    }

    public static function updateStorageEquipment($content)
    {
        $resp = [];
        $requestParams = [
            'EtonCode'    => $content['Code'] ?? '',
            'Status'      => $content['Status'] ?? null,
            'UpdatedBy'   => $content['UpdatedBy'],
            'UpdatedDate' => date("Y-m-d"),
            'ObjectId'    => $content['ObjectId'],
            'ObjectType'  => $content['ObjectType']
        ];
        $result = Utils::callWMSOPSRequest('/api/v0.1/Transport/UpdateTransportStatus', $requestParams);
        if ($result) {
            $resp[] = [
                'Status'        => !$result['HasError'],
                'ErrorMessage'  => $result['ErrorMessages'] ?? ''
            ];
        }
        return $resp;
    }
}