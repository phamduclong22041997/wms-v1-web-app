<?php

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\NetworkingBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class RoomBiz {

    /**
     * Get list
     */
    public static function getRoomCombo()
    {
        $collection = self::getCollection();
        $cursor = $collection->find(['isdeleted' => 0, 'status' => true], ['sort' => ['roomcode' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $doc) {
            $data['rows'][] = array(
                'roomcode'      => $doc->roomcode,
                'roomname'      => $doc->roomname,
                'roomname_en'   => $doc->roomname_en,
                'roomtype'      => $doc->roomtype,
            );
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult(self::getCollection(), $filters ,$searchParams);
        $data = [];
        $from = $result['start'];
        foreach($result['cursor'] as $doc) {
            $dataItem = self::makeData($doc);
            $dataItem['index']  = ++$from;
            $data[] = $dataItem;
        }
        return array(
            'rows'  => $data,
            'total' => $result['total']
        );
    }

    /**
     * Get one data
     */
    public static function getOne($searchParams)
    {
        if(!isset($searchParams['roomcode'])) {
            throw new \Exception('mess.room.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['roomcode' => $searchParams['roomcode'], 'isdeleted' => 0]);
        if($obj == null) {
            throw new \Exception('mess.room.notfound');
        }
        return self::makeData($obj);
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $ref = $data['ref']??"";
        $isNew = true;
        $result = null;
        $collection = self::getCollection();
        $action = "CREATE";
        if($ref != "") {
            $action = "UPDATE";
            if(isset($data['isdeleted']) && $data['isdeleted'] == 1) {
                $action = "DELETE";
            }
        }
        self::validate($data,  $action);

        if($ref == "") {
            $persist = new Document();
        } else {
            $isNew = false;
            $persist = $collection->findOne(['roomcode' => $ref, 'isdeleted' => 0]);
        }
        if($persist != null) {
            $persist->grantData($data);
            if($isNew) {
                $result = (string)$collection->insertOne($persist)
                                     ->getInsertedId();
            } else {
                if(isset($data['isdeleted'])) {
                    $persist->isdeleted = $data['isdeleted'];
                }
                $collection->updateOne(
                    ['roomcode' => $ref, 'isdeleted' => 0],
                    ['$set' => $persist]
                );
                $result = (string)$persist['_id'];
            }
        }
        if($action == "UPDATE") self::updateToRelatedObject($data);
        return $result;
    }

    /**
     * Get room type
     */
    public static function getRoomType()
    {
        $collection = MongoDBManager::getCollection(Configuration::COLLECTION_ROOM_TYPE, Configuration::$CONNECTION);
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['type' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['type' => $item->type];
            $data['total'] += 1;
        }
        return $data;
    }

    private static function updateToRelatedObject($data){
        $_data = is_object($data) ? clone($data) : $data;
        $unsetKey = ['isdeleted', '_id', 'lastmodified', 'createddate', 'modifiedby'];
        for($i = 0; $i < count($unsetKey); $i++){
            if(isset($_data[$unsetKey[$i]])){
                unset($_data[$unsetKey[$i]]);
            }
        }

        self::updateToFloor($_data);
        self::updateToPoint($_data);
    }

    /**
     * Update Room To Floor
     */
    private static function updateToFloor($data)
    {
        $floorCollection = MongoDBManager::getCollection(Configuration::COLLECTION_FLOOR, Configuration::$CONNECTION);
        $floor = $floorCollection->find(['room.roomcode' => ['$regex' => $data['roomcode'], '$options' => 'i'], 'isdeleted' => 0]);
        if($floor){
            foreach($floor as $f){
                $floorCollection->updateOne(
                    ['floorcode' => ['$regex' => $f['floorcode'], '$options' => 'i'],
                    'room.roomcode' => ['$regex' => $data['roomcode'], '$options' => 'i'], 'isdeleted' => 0],
                    ['$set' => ['room' => $data]]
                );
            }            
        }
    }

    /**
     * Update Room To Floor
     */
    private static function updateToPoint($data)
    {
        $pointCollection = MongoDBManager::getCollection(Configuration::COLLECTION_POINT, Configuration::$CONNECTION);
        $points = $pointCollection->find(['room.roomcode' => ['$regex' => $data['roomcode'], '$options' => 'i'], 'isdeleted' => 0]);
        if($points){
            foreach($points as $point){
                $pointCollection->updateOne(
                    ['pointcode' => ['$regex' => $point['pointcode'], '$options' => 'i'],
                    'room.roomcode' => ['$regex' => $data['roomcode'], '$options' => 'i'],
                    'isdeleted' => 0],
                    ['$set' => ['room' => $data]]
                );
            }
        }
    }

    /**
     * Validate
     */
    private static function validate($data,  $action)
    {
        if($action === 'CREATE') {
            $collection = self::getCollection();
            $count = $collection->count(['roomcode' => $data['roomcode'], 'isdeleted' => 0]);
            if($count > 0) {
                throw new \Exception("Mã Phòng đã tồn tại trong hệ thống. Vui lòng nhập lại.");//"Room Code is existed in the system. Please enter again.");
            }
        }
        if($action === 'DELETE') {
            // Check is using in Floor Collection
            if(isset($data['isdeleted']) && $data['isdeleted']){
                $floorCollection = MongoDBManager::getCollection(Configuration::COLLECTION_FLOOR, Configuration::$CONNECTION);
                $floor = $floorCollection->findOne(['room.roomcode' => ['$regex' => $data['ref'], '$options' => 'i'], 'isdeleted' => 0]);
                if($floor){
                    throw new \Exception('Mã phòng đã sử dụng trong hệ thống. Không thể xóa');
                }
            }
            // Check is using in Point Collection
            if(isset($data['isdeleted']) && $data['isdeleted']) {
                $networking_point_collection = MongoDBManager::getCollection(Configuration::COLLECTION_POINT, Configuration::$CONNECTION);
                $callbackResult = $networking_point_collection->findOne(['room.roomcode' => ['$regex' => $data['ref'], '$options' => 'i'], 'isdeleted' => 0]);
                if ($callbackResult) {
                    throw new \Exception("Mã phòng đã sử dụng trong hệ thống. Không thể xóa");
                }
            }
        }
    }

    /**
     * Make response data
     */
    private static function makeData($doc)
    {
        return array(
            'roomcode'      => $doc->roomcode,
            'roomname'      => $doc->roomname,
            'roomname_en'   => $doc->roomname_en,
            'roomtype'      => $doc->roomtype,
            'status'        => $doc->status
        );
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = [];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['roomcode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_ROOM, Configuration::$CONNECTION);
    }
}