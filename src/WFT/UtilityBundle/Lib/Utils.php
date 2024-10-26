<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\UtilityBundle\Lib;

use OVCore\SecurityBundle\Lib\SecurityManager;
use OVCore\ConfigurationBundle\Lib\Configuration;

class Utils {
    public static function generateTransferSession($prefix, $data, $property, $hyphenlength,$position='left')
    {     
        $bizObject = new \WFT\TransferSessionBundle\Lib\BizObject\TransferSession();
        $cursor = $bizObject->getCollection()->find(['IsDeleted' => 0], ['sort' => [$property => -1], 'limit' => 1]);
        $record = $cursor->toArray();  
        $lastNumber = ($record) ? intval(substr(explode($prefix, $record[0][$property])[1],-3,3)) + 1 : 1;
        $code = $prefix .  $data['C3PL'].  date("ymd") . str_pad((string) $lastNumber, $hyphenlength, "0", ($position == 'left') ? STR_PAD_LEFT: STR_PAD_RIGHT);
        return strtoupper($code);
    }

    public static function callWMSOPSRequest($api, $data)
    {
        try {
            $domain =  Configuration::getConfig('wms_host');
            $clientInfo  = SecurityManager::getClientInfo()->getInfo();
            
            if(!$clientInfo['CrossToken']) {
                return null;
            }

            $warehouseId = $clientInfo['WarehouseId']??"";
            if(!$warehouseId) {
                return null;
            }
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => $domain.$api,
                // CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                // CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => array(
                    // "Content-Length: 0",
                    "Content-Type: application/json",
                    "warehouseid: ".$warehouseId,
                    "Authorization: Bearer ".$clientInfo['CrossToken']
                ),
            ));
            $response = curl_exec($curl);
            curl_close($curl);

            //  $curl_error = curl_error($curl);
            // var_dump("Error Request WOU", $curl_error, $response);
            // exit;

            if($response) {
                return json_decode($response, true);
            }

        }catch(Exception $e) {
        }
        return null;
    }

    public static function getWarehouseId()
    {
        $clientInfo  = SecurityManager::getClientInfo()->getInfo();
        return $crossInfo['Warehouse']??"";
    }
}