<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/16
 * Modified by: Duy Huynh
 */

namespace EFT\ClientBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ClientBundle\Lib\BizObject\ClientType;
use EFT\ClientBundle\Lib\BizObject\Client;

class ClientTypeBiz {

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new ClientType();
        $filters = self::makeFilter($searchParams);
        $searchParams['sort'] = ['clienttypecode' => 1];
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
    public static function getClientTypeCombo()
    {
        $bizObject = new ClientType();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['clienttypename' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeData($item);
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get one data
     */
    public static function getOne($searchParams)
    {
        $bizObject = new ClientType();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new ClientType();
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
            'clienttypecode' => new \MongoDB\BSON\Regex("^".$document['clienttypecode']."$", 'i'), 
            'isdeleted' => 0
        ]);
        if($count > 0) {
            throw new \Exception("mess.existed");
        }
    }

    /**
     * Nếu loại khách hàng đã sử dụng thi quăng ngoại lê - Mã loại khách hàng đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        $clientBiz = new Client();
        $clientCollection = $clientBiz->getCollection();
        $count = $clientCollection->count(['clienttype.clienttypecode' => ['$regex' => $obj->clienttypecode, '$options' => 'i'], 'isdeleted' => 0]);
    
        if($count){
            throw new \Exception('Mã loại khách hàng đã sử dụng trong hệ thống. Không thể xóa');
        }
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['clienttypecode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
            //$filters['clienttypename'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }
}