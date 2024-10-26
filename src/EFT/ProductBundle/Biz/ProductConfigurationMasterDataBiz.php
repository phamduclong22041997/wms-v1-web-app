<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/18s
 * Modified by: Duy Huynh
 */

namespace EFT\ProductBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ProductBundle\Lib\BizObject\ProductConfigurationMasterData;
use EFT\ProductBundle\Lib\BizObject\ProductConfigurationMasterDataType;
use EFT\ProductBundle\Lib\BizObject\ProductConfigurationMasterDataCode;

class ProductConfigurationMasterDataBiz {
    
    /**
     * Get Warehouse Position
     */
    public static function getCombo($type)
    {        
        $bizObject = new ProductConfigurationMasterData();
        $collection = $bizObject->getCollection();
        $cursor = $collection->find(['type.type' => $type, 'isdeleted' => 0], ['sort' => ['code' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {           
            $data['rows'][] = $bizObject->makeDataCombo($item);
            $data['total'] += 1;
        }
        return $data;
    }


    /**
     * Get Warehouse Position
     */
    public static function getMasterDataTypeCombo()
    {
        $bizObject = new ProductConfigurationMasterDataType();
        $collection = $bizObject->getCollection();
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['type' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['type' => $item->type, 'description' => $item->description];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get Warehouse Position
     */
    public static function getMasterDataCodeCombo($type)
    {
        $bizObject = new ProductConfigurationMasterDataCode();
        $collection = $bizObject->getCollection();
        $cursor = $collection->find(['type' => $type, 'isdeleted' => 0], ['sort' => ['code' => 1]]);
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
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new ProductConfigurationMasterData();
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
     * Get one data
     */
    public static function getOne($searchParams)
    {
        $bizObject = new ProductConfigurationMasterData();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new ProductConfigurationMasterData();
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
            'code' => $document['code'],
            'type' => $document['type'],
            'isdeleted' => 0
        ]);
        if($count > 0) {
            throw new \Exception("mess.existed");
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
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $_filters = [];
            $_filters[] = ['code' => ['$regex' => $searchParams['keyword'], '$options' => 'i']];
            $_filters[] = ['code.code' => ['$regex' => $searchParams['keyword'], '$options' => 'i']];
            
            $filters['$or'] = $_filters;
        }

        if (isset($searchParams['filter']) && $searchParams['filter']) {
            if (isset($searchParams['filter']['description'])) {
                $filters['type'] = ['$regex' => $searchParams['filter']['description'], '$options' => 'i'];
            }
        }
        
        return $filters;
    }
}