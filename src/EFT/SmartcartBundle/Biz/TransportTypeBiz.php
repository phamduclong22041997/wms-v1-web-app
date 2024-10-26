<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/16
 * Modified by: Duy Huynh
 */

namespace EFT\SmartcartBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\SmartcartBundle\Lib\BizObject\TransportType;
use EFT\SmartcartBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;

class TransportTypeBiz {

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new TransportType();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters ,$searchParams);
        $data = [];
        $from = $result['start'];
        foreach($result['cursor'] as $doc) {
            $dataItem = $bizObject->makeData($doc);
            $dataItem['index']  = ++$from;
            $data[] = $dataItem;
        }
        return array(
            'rows'  => $data,
            'total' => $result['total']
        );
    }

    /**
     * Get Warehouse Position
     */
    public static function getTransportTypeCombo()
    {
        $bizObject = new TransportType();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['name' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeData($item);;
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get one data
     */
    public static function getOne($searchParams)
    {
        $bizObject = new TransportType();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new TransportType();
        $bizObject->loadDocument($data);

        if($bizObject->isNew()) {
            self::validate($bizObject);
        }
        if($bizObject->isRemove()) {
            self::checkPeristData($bizObject->getDocument());
        }

        return $bizObject->save();
    }

    /**
     * Validate
     */
    private static function validate($bizObject)
    {
        $collection = $bizObject->getCollection();
        $document = $bizObject->getDocument();

        $count = $collection->count([
            'transporttypecode' => new \MongoDB\BSON\Regex("^".$document['transporttypecode']."$", 'i'), 
            'isdeleted' => 0
        ]);
        if($count > 0) {
            throw new \Exception("Mã thiết bị vận chuyển đã tồn tại trong hệ thống.  Vui lòng nhập lại.");
        }
    }

    /**
     * Nếu kho đã sử dụng thi quăng ngoại lê - Mã kho đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        $transportCollection = MongoDBManager::getCollection('NetworkingTransportDevice', Configuration::$CONNECTION);
        $count = $transportCollection->count(['transportdevicetype.type' => ['$regex' => $obj->transporttypename, '$options' => 'i'], 'isdeleted' => 0]);
        if($count){
            throw new \Exception('Mã loại thiết bị vận chuyển đã sử dụng trong hệ thống. Không thể xóa');
        }
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['transporttypecode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }
}