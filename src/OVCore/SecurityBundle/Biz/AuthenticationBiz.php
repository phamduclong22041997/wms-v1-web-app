<?php
namespace OVCore\SecurityBundle\Biz;

use OVCore\ConfigurationBundle\Lib\Configuration;
use OVCore\SecurityBundle\Lib\SecurityManager;
use Blocktrail\CryptoJSAES\CryptoJSAES;
use OVCore\UtilityBundle\Lib\Utility; 

class AuthenticationBiz
{
    /**
     * Generate session
     */
    public static function generateSession($apisid, $sid, $appName = null)
    {
        $validate = self::validate($apisid, $sid);
        if($validate['Status'] == false) {
            return array(
                'valid' => false,
                'token' => ""
            );
        }
        $clientCode = "";
        $current_site = 'https://'.$_SERVER[HTTP_HOST];
        $role = "";
        $siteInfo = null;

        foreach($validate['Data']['Sites'] as $val) {
            if($appName != null) {
                $_appName = md5($val['Code']);
                if($val['Url'] == $current_site && strtolower($_appName) == strtolower($appName)) {
                    $role = $val['Role'];
                    $siteInfo = $val;
                    $clientCode = $val['Code'];
                }
            } else {
                if($val['Url'] == $current_site) {
                    $role = $val['Role'];
                    $appName =  md5($val['Code']);
                    $clientCode = $val['Code'];
                    $siteInfo = $val;
                    break;
                }
            }
        }

        if($role === "") {
            return array(
                'valid' => false,
                'token' => ""
            );
        }
        $uid = self::decrypt($apisid, $sid);
        $token = SecurityManager::generateToken($apisid, $uid);
        $_data = array(
            'Role'          => $role,
            'LoginName'     => $validate['Data']['UserName'],
            'Email'         => $validate['Data']['Email'],
            'Timezone'      => $validate['Data']['Timezone'],
            'Fullname'      => $validate['Data']['FullName'],
            'DisplayName'   => $validate['Data']['DisplayName'],
            'AppID'         => $appName,
            'Warehouse'     => $clientCode,
            'PositionType'  => $validate['Data']['PositionType'],
            'SiteInfo'      => $siteInfo
        );

        $clientInfo = SecurityManager::generateClientInfo($_data, $token);

        if($clientInfo == null) {
            throw new \Exception('Bạn không có quyền truy cập hệ thống.');
        }

        //Get menu
        return array(
            'valid'         => true,
            'token'         => $token,
            'info'          => $clientInfo->toArray(),
            'appid'         => $appName,
            'apisid'        => $apisid,
            'sid'           => $sid,
            'menu'          => AuthorizationBiz::getMenuList($role)
        );
    }

    /**
     * Validate session
     */
    public static function validate($token, $rawAccount)
    {
        $current_site = $_SERVER[HTTP_HOST];
        $postData = array(
            'APISID'        => $token,
            'SID'           => $rawAccount,
            'CurrentSite'   => $current_site
        );
        $url = Configuration::getConfig('authen').'/api/auth/validatesession';
        $curl = curl_init();
        $head = array('Accept: application/json','Content-Type: application/json');
        curl_setopt($curl, CURLOPT_HTTPHEADER, $head);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($postData));

        $responseContent = curl_exec($curl);
        
        $curl_error = curl_error($curl);
        curl_close($curl);
        if($curl_error) {
            return array(
                'Status' => false,
                'Data'   => $curl_error
            );
        }
        return json_decode($responseContent, true);
    }

    /**
     * Decript
     */
    private static function decrypt($token, $sid)
    {
        $salt = strtolower(preg_replace("/\s/i", "", strrev($sid)));
        $originalToken = CryptoJSAES::decrypt($token, $salt.$sid);

        $key = preg_replace("/\s/i", "", strrev($originalToken));
        $salt = strtolower(preg_replace("/\s/i", "", strrev($key)));

        return CryptoJSAES::decrypt($sid, $salt.$key);
    }
}
