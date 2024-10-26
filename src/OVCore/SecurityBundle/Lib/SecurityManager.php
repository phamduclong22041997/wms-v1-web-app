<?php
/**
 * Modified by: Duy Huynh
 */
namespace OVCore\SecurityBundle\Lib;

use OVCore\MongoBundle\Lib\MongoDBTransaction;
use OVCore\MongoBundle\Lib\MongoDBManager;

class SecurityManager {
    const CACHE_NAME = "clients";
    private static $_clientInfo = null;

    /**
     * Check Authentication by token
     */
    public static function authen($route)
    {
        if(self::passAuthentication($route)) {
            return true;
        }

        $token = \OVCore\SecurityBundle\Lib\Config::$token;
        if (is_null($token) || $token == "unknown") {
            return false;
        }

        $timeout = Config::$config['LIFE_TIMEOUT_AUTH'];
        $time_now = time();
        $clientInfo = self::$_clientInfo;
        if($clientInfo == null) {
            return false;
        }

        if($timeout == 0)
            return true;

        $variantTime = $clientInfo->getAccessTime();

        $timeexp = $time_now - $variantTime;
        if ($timeexp > $timeout) {
            self::removeSession($token);
            return false;
        }
    }

    /**
     * Check allow access
     */
    public static function allowAccess($route, $sc)
    {
        if(self::passAuthorization($route)) {
            return true;
        }

        $collection = MongoDBManager::getCollection(
            Configuration::COLLECTION_PERMISSION,
            Configuration::$CONNECTION
        );
        $role = self::$_clientInfo->getRole();
        $obj = $collection->findOne(['role' => $role]);
        if($obj == null || !isset($obj['data'])) {
            return false;
        }
        if(!isset($obj['data'][$sc]) || !$obj['data'][$sc]['selected']  || !isset($obj['data'][$sc]['resources'])) {
            return false;
        }

        $allowAccess = false;

        $resource = $obj['data'][$sc]['resources'];
        foreach($resource as $item) {
            if($item['resourceid'] == $route) {
                $allowAccess = $item['selected'];
                break;
            }
        }

        return $allowAccess;
    }

    /**
     * Initial
     */
    public static function init()
    {
        // Config::loadConfig();
        self::loadClientInfoFromCache();
    }

    /**
     * Generate client info
     */
    public static function consoleClientInfo($info)
    {
        \OVCore\SecurityBundle\Lib\Config::$token = $info['loginname'];
        self::$_clientInfo = new ClientInfo();
        self::$_clientInfo->grantAccessTime();
        self::$_clientInfo->setSession($info);
        return self::$_clientInfo;
    }

    /**
     * Generate client info
     */
    public static function generateClientInfo($info, $token)
    {
        \OVCore\SecurityBundle\Lib\Config::$token = $token;
        self::loadClientInfoFromCache();

        $xref = substr($token, 0, 32);
        $clientInfo = null;
        if(self::$_clientInfo == null) {
            $clientInfo = new ClientInfo();
        } else {
            $clientInfo = self::$_clientInfo;
            $clientInfo->grantAccessTime();
        }
        $info['Id'] = $xref;
        $clientInfo->setSession($info);
        $data = self::loadDataFromCache();
        $data[$xref] = $clientInfo;
        //Save data to cache
        Cache\CacheManager::saveData(self::CACHE_NAME, $data);
        return $clientInfo;
    }

    /**
     * Remove token
     */
    private static function removeSession($token)
    {
        $data = self::loadDataFromCache();
        $clientInfo = self::$_clientInfo;
        $xref = $clientInfo->getId();
        $totalSession = $clientInfo->removeToken($token);
        if($totalSession == 0) {
            unset($data[$xref]);
        } else {
            $data[$xref] = $clientInfo;
        }
        Cache\CacheManager::saveData(self::CACHE_NAME, $data);
    }

    /**
     * Load client info from cache
     */
    private static function loadClientInfoFromCache()
    {
        $token = \OVCore\SecurityBundle\Lib\Config::$token;
        if($token) {
            $xref = substr($token, 0, 32);
            if(self::$_clientInfo == null) {
                $_data = self::loadDataFromCache();
                if(isset($_data[$xref])) {
                    self::$_clientInfo = $_data[$xref];
                }
            }
        }
        return self::$_clientInfo;
    }

    /**
     * Get cache data
     */
    private static function loadDataFromCache()
    {
        $_data = Cache\CacheManager::loadData(self::CACHE_NAME);
        if(!$_data) {
            $_data = array();
        }
        return $_data;
    }

    /**
     * Generate token
     */
    public static function generateToken($apid, $sid)
    {
        $first =  hash('tiger128,3', $sid, false);
        $last =  hash('tiger128,3', $apid, false);
        return $first.$last;
    }

    /**
     * Get client information
     * @return object
     *
     **/
    public static function getClientInfo()
    {
        return self::$_clientInfo;
    }

    /**
     * Pass authentication
     */
    private static function passAuthentication($route)
    {
        $resourceList = array(
            'ovcore_security_authentication_sso',
            'ovcore_security_authentication_session',
            'eft_file_image',
            'eft_import_file'
        );
        return in_array($route, $resourceList);
    }

    /**
     * Pass authorization
     */
    private static function passAuthorization($route) 
    {
        $resourceList = array(
            'ovcore_security_authentication_sso',
            'ovcore_security_authentication_session',
            'ovcore_security_authorization_grantpermission',
            'ovcore_security_authorization_screenlist',
            'ovcore_security_authorization_rolelist',
            'ovcore_security_authorization_list',
            'ovcore_security_authorization_save',
            'ovcore_security_authorization_remove',
            'eft_file_image',
            'eft_import_file'
        );
        return in_array($route, $resourceList);
    }

    private static $firstKey = "BmpOFyDKVFn8HZJfx6CgjmxXo7nEpkdvUABr1GNBJKo=";
    /**
     * Encrypt
     */
    public static function encrypt($text)
    {
        $first_key = base64_decode(self::$firstKey);
        $method = "aes-256-cbc";
        $iv_length = openssl_cipher_iv_length($method);
        $iv = openssl_random_pseudo_bytes($iv_length);
        $first_encrypted = openssl_encrypt($text, $method, $first_key, OPENSSL_RAW_DATA ,$iv);
        return base64_encode($iv.$first_encrypted);
    }

    /**
     * Decrypt
     */
    public static function decrypt($cipher)
    {
        $first_key = base64_decode(self::$firstKey);
        $mix = base64_decode($cipher);
        $method = "aes-256-cbc";
        $iv_length = openssl_cipher_iv_length($method);

        $iv = substr($mix,0,$iv_length);
        $first_encrypted = substr($mix,$iv_length);
        $data = openssl_decrypt($first_encrypted, $method, $first_key,OPENSSL_RAW_DATA,$iv);
        return $data;
    }
}
