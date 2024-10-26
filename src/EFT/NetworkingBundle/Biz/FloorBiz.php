<?php

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\NetworkingBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class FloorBiz
{
    /**
     * Get list
     */
    public static function getFloorCombo()
    {
        $collection = self::getCollection();
        $cursor = $collection->find(['isdeleted' => 0, 'status' => true], ['sort' => ['floorcode' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $doc) {
            $data['rows'][] = array(
                'floorcode'      => $doc->floorcode,
                'floorname'      => $doc->floorname,
                'floorname_en'   => $doc->floorname_en,
                'room'           => $doc->room,
                'flooracreage'   => $doc->flooracreage,
                'floorheight'    => $doc->floorheight,
                'status'         => $doc->status
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
        $result = Utils::paginationResult(self::getCollection(), $filters, $searchParams);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $dataItem = self::makeData($doc);
            $dataItem['index']  = ++$from;
            // $dataItem['actions'] = ['view', 'edit', 'delete'];
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
        if (!isset($searchParams['floorcode'])) {
            throw new \Exception('mess.floor.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['floorcode' => $searchParams['floorcode'], 'isdeleted' => 0]);
        if ($obj == null) {
            throw new \Exception('mess.floor.notfound');
        }
        return self::makeData($obj);
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $ref = $data['ref'] ?? "";
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
        if ($ref == "") {
            $persist = new Document();
        } else {
            $isNew = false;
            $persist = $collection->findOne([
                'floorcode' => $ref, 
                'room.roomcode' => $data['room']['roomcode']??"",
                'isdeleted' => 0
            ]);
        }
        if ($persist != null) {
            $persist->grantData($data);
            if ($isNew) {
                $result = (string) $collection->insertOne($persist)
                    ->getInsertedId();
            } else {
                if(isset($data['isdeleted'])) {
                    $persist->isdeleted = $data['isdeleted'];
                }
                $collection->updateOne(
                    [
                        'floorcode' => $ref,
                        'room.roomcode' => $data['room']['roomcode']??"",
                        'isdeleted' => 0
                    ],
                    ['$set' => $persist]
                );
                $result = (string) $persist['_id'];
            }
        }
        return $result;
    }

    /**
     * Validate
     */
    private static function validate($data, $action)
    {
        if($action === 'CREATE') {
            $collection = self::getCollection();
            $count = $collection->count([
                'floorcode'     => ['$regex' => $data['floorcode'], '$options' => 'i'],
                'room.roomcode' => ['$regex' => $data['room']['roomcode'], '$options' => 'i'],
                'isdeleted'     => 0
            ]);
            if ($count > 0) {
                throw new \Exception("Mã tầng của phòng này đã tồn tại trong hệ thống. Vui lòng nhập lại.");//"Floor Code is existed in the system. Please enter again.");
            }
        }
        if($action === 'DELETE') {
            // Check is using in Point Collection
            if(isset($data['isdeleted']) && $data['isdeleted']) {
                $networking_point_collection = MongoDBManager::getCollection(Configuration::COLLECTION_POINT, Configuration::$CONNECTION);
                $callbackResult = $networking_point_collection->findOne(['floor.floorcode' => ['$regex' => $data['ref'],'$options' => 'i'] , 'isdeleted' => 0]);
                if ($callbackResult) {
                    throw new \Exception("Mã tầng đã sử dụng trong hệ thống. Không thể xóa");
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
            'floorcode'      => $doc->floorcode,
            'floorname'      => $doc->floorname,
            'floorname_en'   => $doc->floorname_en,
            'room'           => $doc->room,
            'flooracreage'   => $doc->flooracreage, 
            'floorheight'    => $doc->floorheight,
            'status'         => $doc->status
        );
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if (isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['floorcode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        if(isset($searchParams['filter'])) {
            if (isset($searchParams['filter']['roomcode']) && trim($searchParams['filter']['roomcode'])) {
                $filters['room.roomcode'] = $searchParams['filter']['roomcode'];
            }
        }
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_FLOOR, Configuration::$CONNECTION);
    }
}
