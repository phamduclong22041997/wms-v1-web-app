<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\TransferSessionBundle\Lib;

use OVCore\SecurityBundle\Lib\SecurityManager;
use OVCore\UtilityBundle\Lib\Utility;

class WMSClient
{
    public static function getClients($searchParams)
    {
        $requestParams = [
            'Content' => $searchParams['Content'] ? $searchParams['Content'] : 'WIN',
            'PageIndex' => 1
        ];
        // $resp = [];
        // $resp[] = [
        //     'Id'            => 11,
        //     'Code'          => 'ETN',
        //     'ShortName'     => 'ETON Viet Nam',
        //     'FullName'      => 'ETN - ETON Viet Nam',
        //     'FullAddress'   => NULL,
        //     'ContactPhone'  => '083123456'
        // ];
        // $resp[] = [
        //     'Id'            => 10097,
        //     'Code'          => 'WIN',
        //     'ShortName'     => 'Vinmart+',
        //     'FullName'      => 'WIN - Vinmart+',
        //     'FullAddress'   => NULL,
        //     'ContactPhone'  => ''
        // ];
      //  if ($searchParams['Content'] == 'WIN') {
        if(true){
        $resp[] = [
            'Id'            => 10097,
            'Code'          => 'WIN',
            'ShortName'     => 'Vinmart+',
            'FullName'      => 'WIN - Vinmart+',
            'FullAddress'   => NULL,
            'ContactPhone'  => ''
        ];
            // $resp[] = [
            //     'Id'            => 76,
            //     'Code'          => 'VIM',
            //     'ShortName'     => 'Vinmart Online',
            //     'FullName'      => 'VIM - Vinmart Online',
            //     'FullAddress'   => '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
            //     'ContactPhone'  => NULL
            // ];
        } else {
            $result = Utils::callWMSOPSRequest("/api/v0.1/CliClient/Search", $requestParams);
           
            if ($result) {
                if ($result['HasError'] == false && $result['Clients']) {
                    foreach ($result['Clients'] as $client) {
                        $resp[] = [
                            'Id'            => $client['Id'],
                            'Code'          => $client['EtonCode'],
                            'ShortName'     => $client['ShortName'],
                            'FullName'      => $client['EtonCode'].' - '.$client['ShortName'],
                            'FullAddress'   => $client['FullAddress'],
                            'ContactPhone'  => $client['ContactPhone']
                        ];
                    }
                }
            }
        }
        return $resp;
    }
}