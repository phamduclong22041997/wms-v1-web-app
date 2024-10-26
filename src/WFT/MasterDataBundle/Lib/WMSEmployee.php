<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\MasterDataBundle\Lib;

use WFT\UtilityBundle\Lib\Utils;

class WMSEmployee
{
    public static function getEmployee()
    {
        $requestParams = [];
        $resp = [];
        $result = Utils::callWMSOPSRequest("api/v0.1/Employee/GetWarehouseEmployees", $requestParams);
        if ($result) {
            if ($result['HasError'] == false && $result['Results']) {
                foreach ($result['Results'] as $obj) {
                    $resp[] = [
                        'EmployeeId'      => $obj['Id'],
                        'EmployeeCode'    => $obj['Code'],
                        'EmployeeName'    => $obj['DisplayName']
                    ];
                }
            }
        }
        return $resp;
    }
}