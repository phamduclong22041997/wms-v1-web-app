<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/17
 * Modified by: Pham Cuong
 */

namespace EFT\ClientBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ClientBundle\Lib\BizObject\Client;

class ClientBiz {

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new Client();
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
        $bizObject = new Client();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new Client();
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
            'clientcode' => new \MongoDB\BSON\Regex("^".$document['clientcode']."$", 'i'), 
            'isdeleted' => 0
        ]);
        if($count > 0) {
            throw new \Exception("Mã loại khách hàng đã tồn tại trong hệ thống.  Vui lòng nhập lại.");
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
            $filters['clientcode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }
}