<?php
namespace  OVCore\QueueBundle\Lib;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\QueueBundle\Lib\Configuration;

class  ActionQueueManager {
     /**
     * Get Hightest Priority
     */
    public static function getHightestPriorityType()
    {
        $result = self::getCollection()->findOne(
            array('total' => array('$gt' => 0), 'isdeleted' => 0),
            array('sort' => array('priority' => 1, 'total' => 1))
        );

        if($result == null)
            return null;

        return $result['type'];
        return null;
    }

    /**
     * Description: Get Number of Row
     */
    public static function getNumberOfRows($type)
    {
        $result = self::getCollection()->findOne(
            array('type' => $type, 'isdeleted' => 0)
        );

        if($result == null)
            return 0;

        return $result['numberofrows'];
    }

     /**
     * Description: Get Max Item
     */
    public static function getInfo($type)
    {
        $result = self::getCollection()->findOne(
            array('type' => $type, 'isdeleted' => 0)
        );

        return $result;
    }

    /**
     * Description: Analyze data into chunk
     */
    public static function analyzeSegment($type, $total)
    {
        $numberOfRow = self::getNumberOfRows($type);
        //Total pages
        $totalPages = ceil($total/$numberOfRow);
        $segments = array();

        for($i = 0; $i < $totalPages; $i++) {
            $segments[] = array(array(
                'limit' => $numberOfRow,
                'start' => ($i * $totalPages)?(($i * $numberOfRow)) : 0
            ));
        }

        return $segments;
    }

    /**
     * Description: Analyze data into chunk
     */
    public static function analyzeChunk($type, $data)
    {
        $numberOfRow = self::getNumberOfRows($type);
        $chunk = array_chunk($data, $numberOfRow);
        return $chunk;
    }

    /**
     * Description: Update Total
     */
    public static function updateTotal($type, $total)
    {
        self::getCollection()->findOneAndUpdate(
            array('type' => $type, 'isdeleted' => 0),
            array(
                '$inc' => array('total' => $total)
            )
        );
    }


    /**
     * Description: Update Total
     */
    public static function reset($type)
    {
        self::getCollection()->findOneAndUpdate(
            array('type' => $type, 'isdeleted' => 0),
            array(
                '$set' => array('total' => 0)
            )
        );
    }

    /**
     * Get Queue Collection
     */
    public static function getCollection()
    {
        return MongoDBManager::getCollection(
            Configuration::COLLECTION_ACTIONQUEUE,
            Configuration::$CONNECTION
        );
    }
}