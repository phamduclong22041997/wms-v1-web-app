<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/30
 * Modified by: Tri Cao
 */

namespace EFT\ParameterBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ParameterBundle\Lib\BizObject\DefineParameter;

// OVSymFrame-EFT\src\EFT\ParameterBundle\Lib\BizObject\DefineParameter.php

class DefineParameterBiz {

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new DefineParameter();
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
        $bizObject = new DefineParameter();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new DefineParameter();
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
            'objectcode' => new \MongoDB\BSON\Regex("^".$document['objectcode']."$", 'i'),
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
            $filters['objectcode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        
        // if(isset($searchParams['filter']) && $searchParams['filter']){
        //     if(isset($searchParams['filter']['description'])){
        //         $_filters = [
        //             ['object.description' => $searchParams['filter']['description']]
        //         ];
        //         $filters['$or'] = $_filters;
        //     }
        // }
        return $filters;
    }
}