<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/30
 * Modified by: Tri Cao
 */

namespace EFT\ParameterBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ParameterBundle\Lib\BizObject\OperationObject;

class OperationObjectBiz {

     /**
     * Get Operation Object
     */
    public static function getCombo()
    {
        $bizObject = new OperationObject();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['code' => 1]]);
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
        $bizObject = new OperationObject();
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
        $bizObject = new OperationObject();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new OperationObject();
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
            'code' => new \MongoDB\BSON\Regex("^".$document['code']."$", 'i'),
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
            //$filters['object.description'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
            //$filters['statuscode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
            $filters['code'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }
}