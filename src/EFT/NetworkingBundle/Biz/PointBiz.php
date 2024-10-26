<?php

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\NetworkingBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;
use EFT\WarehouseBundle\Lib\BizObject\WarehousePropertyType;

class PointBiz {
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
        if(!isset($searchParams['pointcode'])) {
            throw new \Exception('mess.point.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['pointcode' => $searchParams['pointcode'], 'isdeleted' => 0]);
        if($obj == null) {
            throw new \Exception('mess.pointcode.notfound');
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

        self::validate($data);

        if($ref == "") {
            $persist = new Document();
        } else {
            $isNew = false;
            $persist = $collection->findOne(['pointcode' => $ref, 'isdeleted' => 0]);
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
                    ['pointcode' => $ref, 'isdeleted' => 0],
                    ['$set' => $persist]
                );
                $result = (string)$persist['_id'];
            }
        }
        return $result;
    }

    /**
     * Get room type
     */
    public static function getPointType()
    {
        // $collection = MongoDBManager::getCollection(Configuration::COLLECTION_POINT_TYPE, Configuration::$CONNECTION);
        // $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['type' => 1]]);
        // $data = array(
        //     'rows'  => [],
        //     'total' => 0
        // );
        // foreach($cursor as $item) {
        //     $data['rows'][] = ['type' => $item->type, 'typecode' => $item->typecode];
        //     $data['total'] += 1;
        // }
        // return $data;
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        $warehousePropertyCollection = MongoDBManager::getCollection(Configuration::WAREHOUSE_PROPERTY, Configuration::$CONNECTION);
        $properties = $warehousePropertyCollection->find(['propertytype.code' => WarehousePropertyType::POINT_TYPE, 'isdeleted' => 0]);
        foreach($properties as $property){
            $data['rows'][] = [
                'propertytype' => $property['propertytype'], 
                'propertycode' => $property['propertycode'],
                'propertyname' => $property['propertyname'],
                'propertyname_en' => $property['propertyname_en']
            ];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Validate
     */
    private static function validate($data)
    {
        $collection = self::getCollection();
        if(!isset($data['isdeleted'])) {
            $ref = $data['ref']??"";
            if($ref != "") {
                $obj = $collection->findOne(['xcoordinate' => $data['xcoordinate'], 'ycoordinate' => $data['ycoordinate'], 'isdeleted' => 0]);
                if($obj != null) {
                    throw new \Exception("Vị trí này đã tồn tại trong hệ thống. Vui lòng nhập lại.");//"msg.point.exists");
                }
            } else {
                if($data['status'] == false){
                    $_smCollection = MongoDBManager::getCollection(Configuration::COLLECTION_SMARTCART, Configuration::$CONNECTION);
                    $count = $_smCollection->count(['currentpoint' => ['$regex' => $data['pointcode'] ?? $data['ref'], '$options' => 'i'], 'isdeleted' => 0]);
                    if($count) {
                        throw new \Exception("Vị trí này đang được mapping với 1 đối tương khác, không thê Inactive. Vui lòng kiểm tra lại");
                    }
                }
                
                $obj = $collection->findOne(['xcoordinate' => $data['xcoordinate'], 'ycoordinate' => $data['ycoordinate'], 'pointcode' => ['$ne' => $data['pointcode']], 'isdeleted' => 0]);
                if($obj != null) {
                    throw new \Exception("Vị trí này đã tồn tại trong hệ thống. Vui lòng nhập lại.");//"msg.point.exists");
                }
            }
        } else {
            //$obj = $collection->findOne(['pointcode' => ['$regex' => $data['ref'], '$options' => 'i'], 'isused' => true, 'isdeleted' => 0]);
            $_collection = MongoDBManager::getCollection(Configuration::COLLECTION_SMARTCART, Configuration::$CONNECTION);
            $count = $_collection->count(['currentpoint' => ['$regex' => $data['ref'], '$options' => 'i'], 'isdeleted' => 0]);
            if($count) {
                throw new \Exception("Vị trí này đã sử dụng trong hệ thống. Không thể xóa.");
            }
        }
    }

    /**
     * Make response data
     */
    private static function makeData($doc)
    {
        return array(
            'pointcode'     => $doc->pointcode,
            'room'          => $doc->room,
            'floor'         => $doc->floor,
            'pointtype'     => $doc->pointtype,
            'xcoordinate'   => $doc->xcoordinate,
            'ycoordinate'   => $doc->ycoordinate,
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
            $filters['pointcode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        if(isset($searchParams['filter'])) {
            if(isset($searchParams['filter']['roomcode'])){
                $filters['room.roomcode'] = ['$regex' => $searchParams['filter']['roomcode'], '$options' => 'i'];
            }
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_POINT, Configuration::$CONNECTION);
    }
}