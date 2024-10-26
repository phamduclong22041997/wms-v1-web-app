<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/16
 * Modified by: Duy Huynh
 */

namespace EFT\SmartcartBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\SmartcartBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class SmartcartPurposeBiz {

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
     * Get Warehouse Position
     */
    public static function getSmartcartPurposeCombo()
    {
        $collection = self::getCollection();
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['name' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['code' => $item->code, 'description' => $item->description];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get one data
     */
    public static function getOne($searchParams)
    {
        if(!isset($searchParams['code'])) {
            throw new \Exception('mess.warehouse.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['code' => $searchParams['code'], 'isdeleted' => 0]);
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
            $persist = $collection->findOne(['code' => $ref, 'isdeleted' => 0]);
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
                    ['code' => $ref, 'isdeleted' => 0],
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
        $count = $collection->count(['code' => $data['code'], 'isdeleted' => 0]);
        if($count > 0) {
            throw new \Exception("Mã mục đích sử dụng xe đẩy đã tồn tại trong hệ thống.  Vui lòng nhập lại.");
        }
    }

    /**
     * If object is in used, throw exception
     */
    private static function checkPeristData($obj)
    {
        if(isset($obj->isused) && $obj->isused){
            throw new \Exception('Mã mục đích sử dụng xe đã sử dụng trong hệ thống. Không thể xóa');
        }
    }

    /**
     * Make response data
     */
    private static function makeData($doc)
    {
        return array(
            'code'              => $doc->code,
            'description'       => $doc->description,
            'description_en'    => $doc->description_en,
            'isused'            => $doc->isused
        );
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['code'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
            $filters['description'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_SMART_CART_PURPOSE, Configuration::$CONNECTION);
    }
}