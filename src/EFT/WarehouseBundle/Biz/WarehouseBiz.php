<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/16
 * Modified by: Duy Huynh
 */

namespace EFT\WarehouseBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\WarehouseBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;
use EFT\WarehouseBundle\Lib\BizObject\WarehousePropertyType;
use EFT\WarehouseBundle\Lib\BizObject\Warehouse;

class WarehouseBiz {

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
     * Get room type
     */
    public static function getWarehouseCombo()
    {
        $bizObject = new Warehouse();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['code' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeComboData($item);
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get Warehouse Position
     */
    public static function getWarehousePositionCombo()
    {
        $collection = MongoDBManager::getCollection(Configuration::COLLECTION_WAREHOUSE_POSITION, Configuration::$CONNECTION);
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['name' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['name' => $item->name, 'description' => $item->description];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get room type
     */
    public static function getWarehouseTypeCombo()
    {
        $collection = MongoDBManager::getCollection(\EFT\NetworkingBundle\Lib\Configuration::WAREHOUSE_PROPERTY, Configuration::$CONNECTION);
        $cursor = $collection->find(['propertytype.code' => WarehousePropertyType::WAREHOUSE_TYPE,'isdeleted' => 0]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = [
                'propertytype' => $item['propertytype'], 
                'propertycode' => $item['propertycode'], 
                'propertyname' => $item['propertyname'], 
                'propertyname_en' => $item['propertyname_en']
            ];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get room type
     */
    public static function getWarehouseFunctionCombo()
    {
        $collection = MongoDBManager::getCollection(\EFT\NetworkingBundle\Lib\Configuration::WAREHOUSE_PROPERTY, Configuration::$CONNECTION);
        $cursor = $collection->find(['propertytype.code' => WarehousePropertyType::WAREHOUSE_FUNCTION,'isdeleted' => 0]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = [
                'propertytype' => $item['propertytype'], 
                'propertycode' => $item['propertycode'], 
                'propertyname' => $item['propertyname'], 
                'propertyname_en' => $item['propertyname_en']
            ];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get one data
     */
    public static function getOne($searchParams)
    {
        if(!isset($searchParams['warehousecode'])) {
            throw new \Exception('mess.warehouse.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['warehousecode' => $searchParams['warehousecode'], 'isdeleted' => 0]);
        if($obj == null) {
            throw new \Exception('mess.warehouse.notfound');
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

        if($ref == "") {
            self::validate($data);
            $persist = new Document();
        } else {
            $isNew = false;
            $persist = $collection->findOne(['warehousecode' => $ref, 'isdeleted' => 0]);
        }
        if($persist != null) {
            $persist->grantData($data);
            if($isNew) {
                $result = (string)$collection->insertOne($persist)
                                     ->getInsertedId();
            } else {
                if(isset($data['isdeleted'])) {
                    self::checkPeristData($persist);
                    $persist->isdeleted = $data['isdeleted'];
                }
                $collection->updateOne(
                    ['warehousecode' => $ref, 'isdeleted' => 0],
                    ['$set' => $persist]
                );
                $result = (string)$persist['_id'];
            }
        }
        return $result;
    }

    /**
     * Validate
     */
    private static function validate($data)
    {
        $collection = self::getCollection();
        $count = $collection->count(['warehousecode' => $data['warehousecode'], 'isdeleted' => 0]);
        if($count > 0) {
            throw new \Exception("Mã kho đã tồn tại trong hệ thống.  Vui lòng nhập lại.");//"Warehouse Code is existed in the system. Please enter again.");
        }
    }

    /**
     * Nếu kho đã sử dụng thi quăng ngoại lê - Mã kho đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        return true;
    }

    /**
     * Make response data
     */
    private static function makeData($doc)
    {
        return array(
            'warehousecode'     => $doc->warehousecode,
            'warehousename'     => $doc->warehousename,
            'warehousename_en'  => $doc->warehousename_en,
            'warehousetype'     => $doc->warehousetype,
            'warehousefunction' => $doc->warehousefunction,
            'management'        => $doc->management,
            'address'           => $doc->address,
            'status'            => $doc->status,
            'notes'             => $doc->notes
        );
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = [];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['warehousecode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_WAREHOUSE, Configuration::$CONNECTION);
    }
}