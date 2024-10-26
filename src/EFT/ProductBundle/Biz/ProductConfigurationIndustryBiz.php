<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/18s
 * Modified by: Duy Huynh
 */

namespace EFT\ProductBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ProductBundle\Lib\BizObject\ProductConfigurationIndustry;

class ProductConfigurationIndustryBiz {

    /**
     * Get Warehouse Position
     */
    public static function getCombo()
    {
        $bizObject = new ProductConfigurationIndustry();
        $collection = $bizObject->getCollection();
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['industrycode' => 1]]);
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
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new ProductConfigurationIndustry();
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
        $bizObject = new ProductConfigurationIndustry();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new ProductConfigurationIndustry();
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
            'industrycode' => new \MongoDB\BSON\Regex("^".$document['industrycode']."$", 'i'), 
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
        if(isset($obj->isused) && $obj->isused){
            throw new \Exception('Mã ngành hàng đã sử dụng trong hệ thống. Không thể xóa');
        }
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['industrycode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
            // $filters['uniname'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }
}