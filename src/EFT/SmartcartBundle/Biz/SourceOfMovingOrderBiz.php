<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 02/10/2020
 * Modified by: An Truong
 */

namespace EFT\SmartcartBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\SmartcartBundle\Lib\BizObject\SourceOfMovingOrder;

class SourceOfMovingOrderBiz {

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new SourceOfMovingOrder();
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
        $bizObject = new SourceOfMovingOrder();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new SourceOfMovingOrder();
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
            'sourcemovingcode' => new \MongoDB\BSON\Regex("^".$document['sourcemovingcode']."$", 'i'), 
            'isdeleted' => 0
        ]);
        if($count > 0) {
            throw new \Exception("Mã nguồn tạo lệnh di chuyển đã tồn tại trong hệ thống.  Vui lòng nhập lại");
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
            $filters['$or'] = [
                ['sourcemovingcode' => ['$regex' => $searchParams['keyword'], '$options' => 'i']],
                ['sourcemovingdescription' => ['$regex' => $searchParams['keyword'], '$options' => 'i']],
                ['sourcemovingdescription_en' => ['$regex' => $searchParams['keyword'], '$options' => 'i']]
            ];
        }
        return $filters;
    }
}