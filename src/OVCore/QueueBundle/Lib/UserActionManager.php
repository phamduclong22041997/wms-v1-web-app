<?php

namespace  OVCore\QueueBundle\Lib;

use OVCore\QueueBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\UtilityBundle\Lib\Utility;
use OVCore\SecurityBundle\Lib\SecurityManager;

class  UserActionManager
{
    public static function test($data) 
    {
        throw new \Exception('Hé Lo');
    }

    /**
     * Description: Update Total
     */
    public static function fTotal($actionid, $total)
    {
        self::getCollection()->findOneAndUpdate(
            array('_id' => $actionid),
            array(
                '$inc'      => array('ftotal' => $total)
            )
        );
    }

    /**
     * Description: Update Total
     */
    public static function eTotal($actionid, $total, $mesage)
    {
        self::getCollection()->findOneAndUpdate(
            array('_id' => $actionid),
            array(
                '$inc'       => array('etotal' => $total),
                '$push'      => array('message' => $mesage)
            )
        );
    }

    /**
     * Finish Action
     */
    public static function finishUserAction($actionid, $saveData)
    {
        self::getCollection()->findOneAndUpdate(
            array('_id' => $actionid),
            array('$set'=>array($saveData))
        );
    }

    /**
     * Description: Analyze and push data to queue
     */
    public static function pushToQueue($data)
    {
        $dataList = $data['data'];

        if (isset($data['keygen'])) {
            $keygen = $data['keygen'];
        } else {
            $keygen = Utility::generateKeygen();
        }

        $_saveData = array(
            'cls'               => $data['cls'],
            'method'            => $data['method'],
            'export'            => $data['export']??"",
            'requestcode'       => $data['requestcode'],
            'requesttype'       => $data['requesttype'],
            'filters'           => $data['filters']??null,
            'total'             => count($dataList),
            'ftotal'            => 0,
            'etotal'            => 0,
            'keygen'            => $keygen
        );
        $result = self::createNew($_saveData);

        foreach ($dataList as $_data) {
            ActionQueue::push(array(
                'cls'                   => $data['cls'],
                'method'                => $data['method'],
                'requesttype'           => $data['requesttype'],
                'requestcode'           => $data['requestcode'],
                'total'                 => count($_data),
                'datarows'              => $_data,
                'actionid'              => $result,
                'filters'               => $_saveData['filters']
            ));
        }

        //Update total
        ActionQueueManager::updateTotal($data['requesttype'], count($dataList));

        return array('requestcode' => $data['requestcode'], 'keygen' => $keygen);
    }


    /**
     * Description: Create User Action
     */
    public static function createNew(&$data)
    {
        $clientInfo = SecurityManager::getClientInfo();
        $queueInfo = ActionQueueManager::getInfo($data['requesttype']);

        $data['requestinfo']        = $queueInfo;
        $data['enablenotification'] = $queueInfo['enablenotification'] ?? 1;
        $data['message']            = array();
        $data['modifiedby']         = $clientInfo->getInfo();
        $data['lastmodified']       = new \DateTime();
        $data['isdeleted']          = 0;

        $insertId = self::getCollection()->insertOne($data)->getInsertedId();

        return $insertId;
    }

    /**
     * Get Collection
     */
    public static function getCollection()
    {
        return MongoDBManager::getCollection(
            Configuration::$COLLECTION_USERREQUEST,
            Configuration::$CONNECTION
        );
    }
}
