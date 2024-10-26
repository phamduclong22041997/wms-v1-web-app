<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/15
 * Modified by: Tri Cao
 */

namespace EFT\ReasonBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ReasonBundle\Lib\BizObject\ReasonForCancelPO;

class ReasonForCancelPOBiz {

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new ReasonForCancelPO();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters ,$searchParams);
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
        $bizObject = new ReasonForCancelPO();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new ReasonForCancelPO();
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
            'reasoncode' => new \MongoDB\BSON\Regex("^".$document['reasoncode']."$", 'i'), 
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
            throw new \Exception('Mã lý do xóa PO đã sử dụng trong hệ thống. Không thể xóa');
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
                ['reasoncode' => ['$regex' => $searchParams['keyword'], '$options' => 'i']],
                ['reason' => ['$regex' => $searchParams['keyword'], '$options' => 'i']]
            ];
        }
        return $filters;
    }
}