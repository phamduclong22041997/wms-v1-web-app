<?php

namespace OVCore\UtilityBundle\Lib;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\SecurityBundle\Lib\SecurityManager;

class Utility {

    public static $translator = null;

    public static function getWarehouseById($id)
    {
        $collection = MongoDBManager::getCollection('WFT.Warehouse', "default");
        $obj = $collection->findOne(['Id' => $id]);
        if($obj) {
            return [
                'Code' => $obj['EtonCode'],
                'Name' => $obj['Name']
            ];
        }
        return null;
    }

    public static function convertDateTime($mongoDate, $format = 'Y-m-d H:i:s')
    {
        return $mongoDate->toDateTime()->format($format);
    }

    public static function generateKeygen() 
    {        $uuid = "";
        mt_srand((double) microtime() * 10000);
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);
        $uuid = substr($charid, 0, 8) . $hyphen . substr($charid, 8, 4) . $hyphen . substr($charid, 12, 4) . $hyphen . substr($charid, 16, 4) . $hyphen . substr($charid, 20, 12);
        return strtolower($uuid);
    }

    public static function generateProcessCode($prefix, $collection, $property, $hyphenlength,$position='left')
    {     
     
        $clientId = 'OVEFT';//Hash code
        $collection = MongoDBManager::getCollection($collection,'default');        
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => [$property => -1], 'limit' => 1]);
        $record = $cursor->toArray();     
      
        $lastNumber = ($record) ? intval(substr(explode($prefix, $record[0][$property])[1],-3,3)) + 1 : 1;      
       
        $code = $prefix .  $clientId.  date("ymd") . str_pad((string) $lastNumber, $hyphenlength, "0", ($position == 'left') ? STR_PAD_LEFT: STR_PAD_RIGHT);
        return $code;
    }


    /**
     * Diff date function
     */
    public static function dateDiff($firstTime, $nextTime, $quick = false)
    {
        $interval = $nextTime->diff($firstTime);
        if (!$quick) {
            $h = $interval->format("%H");
            $d = $interval->format("%D");
            $date = ((int) $d * 24) + (int) $h;

            return strval($date) . ":" . $interval->format("%I:%S");
        } else {
            $time = $interval->format("%R%a");
            return $time[0] == '+' ? intval(substr($time, 1)) : intval($time);
        }
    }

    /**
     * @param $date
     * @return \DateTime
     */
    public static function convertMongoDT2PhpDT($date)
    {
        if (!empty($date) && !is_null($date))
            return new \DateTime(date('Y-m-d H:i:s', $date->sec));
    }


    public static function convertClientTime2ServerTime($strDatetime, $format = false)
    {
        $clientInfo = SecurityManager::getClientInfo();

        $serverTimezone = date("e");
        $clientTimezone = date("e");

        if (!is_null($clientInfo)) {

            $clientTimezone = $clientInfo->getClientTimeZone();
        }

        $serverDate = self::convertTime($strDatetime, $clientTimezone, $serverTimezone);

        return $format == false ? $serverDate : $serverDate->format("Y-m-d H:i:s");
    }

    public static function convertServerTime2ClientTime($strDatetime, $format = "Y-m-d H:i:s")
    {
        $clientInfo = SecurityManager::getClientInfo();

        $serverTimezone = date("e");
        $clientTimezone = date("e");

        if (!is_null($clientInfo)) {

            $clientTimezone = $clientInfo->getClientTimeZone();
        }

        $clientDate = self::converttime($strDatetime, $serverTimezone, $clientTimezone);

        return $clientDate->format($format);
    }

    /**
     * Convert from UTC to Client Tiem
     */
    public static function convertUTC2ClientTime($strDatetime, $format = "Y-m-d H:i:s")
    {
        $clientInfo = SecurityManager::getClientInfo();

        $clientTimezone = date("e");
        if (!is_null($clientInfo)) {
            $clientTimezone = $clientInfo->getClientTimeZone();
        }

        $clientDate = self::convertTime($strDatetime, 'UTC', $clientTimezone);

        return $clientDate->format($format);
    }

    public static function convertDateStringToPhpDT($datestr)
    {
        $realDatestr = substr($datestr, 0, 10) . ' ' . substr($datestr, 11, 8);

        $clientTimezone = date("e");
        $clientInfo = SecurityManager::getClientInfo();
        if (!is_null($clientInfo))
            $clientTimezone = $clientInfo->getClientTimeZone();

        $clientTZ = new \DateTimeZone($clientTimezone);
        $serverTZ = new \DateTimeZone(date("e"));
        $clientDate = new \DateTime($realDatestr, $clientTZ);
        //echo "America/New_York: ".$clientDate->format('Y-m-d H:i:s');
        $clientDate->setTimezone($serverTZ);

        return $clientDate;
    }

    public static function convertTime($dateStr, $fromTimeZone, $toTimeZone)
    {
        $fromTZ = new \DateTimeZone($fromTimeZone);
        $toTZ = new \DateTimeZone($toTimeZone);
        $fromDate = new \DateTime($dateStr, $fromTZ);

        $fromDate->setTimezone($toTZ);

        return $fromDate;
    }

    /**
     * Description: Convert Date Time String to Mongo Date
     *
     **/
    public static function convert2MongoDate($dateStr)
    {
        $tz = date_default_timezone_get();
        date_default_timezone_set('UTC');
        $date = new \MongoDate(strtotime($dateStr));
        date_default_timezone_set($tz);

        return $date;
    }

    /**
     * Description: Convert Date Time String to Mongo Date
     *
     **/
    public static function convert2ClientTime($dateStr, $format = "Y-m-d H:i:s")
    {
        $clientTimezone = date("e");
        $clientInfo = SecurityManager::getClientInfo();
        if (!is_null($clientInfo))
            $clientTimezone = $clientInfo->getClientTimeZone();

        $tz = new \DateTimeZone($clientTimezone);
        $date = new \DateTime($dateStr);
        $date->setTimezone($tz);

        return $date->format($format);;
    }

    /**
     * Description: Convert Client Time to UTC
     *
     **/
    public static function convertClientTime2UTC($dateStr, $format = "Y-m-d H:i:s")
    {
        $clientTimezone = date("e");
        $clientInfo = SecurityManager::getClientInfo();
        if (!is_null($clientInfo))
            $clientTimezone = $clientInfo->getClientTimeZone();

        $tz = new \DateTimeZone("UTC");
        $clTz = new \DateTimeZone($clientTimezone);
        $date = new \DateTime($dateStr, $clTz);
        $date->setTimezone($tz);

        return $date->format($format);
    }

    /**
     * Description: Convert Server Time to UTC
     *
     **/
    public static function convertServerTime2UTC($dateStr, $format = "Y-m-d H:i:s")
    {
        $clientTimezone = date("e");
        $tz = new \DateTimeZone("UTC");
        $clTz = new \DateTimeZone($clientTimezone);
        $date = new \DateTime($dateStr, $clTz);
        $date->setTimezone($tz);

        return $date;
    }

}
