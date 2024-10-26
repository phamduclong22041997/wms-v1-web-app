<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */
namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\NetworkingBundle\Lib\BizObject\AddressArea;

class AddressAreaBiz {

    /**
     * Get room type
     */
    public static function getAreaCombo()
    {
        $bizObject = new AddressArea();
        $collection = $bizObject->getCollection();
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['areaname' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['areacode' => $item->areacode, 'areaname' => $item->areaname, 'areaname_en' => $item->areacode_en];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new AddressArea();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters, $searchParams);
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
        $bizObject = new AddressArea();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new AddressArea();
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
     * Nếu kho đã sử dụng thi quăng ngoại lê - Mã kho đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        return true;
    }

    /**
     * Validate
     */
    private static function validate($bizObject)
    {
        $collection = $bizObject->getCollection();
        $document = $bizObject->getDocument();
        $count = $collection->count([
            'areacode' => new \MongoDB\BSON\Regex("^".$document['areacode']."$", 'i'), 
            'isdeleted' => 0
        ]);
        if($count > 0) {
            throw new \Exception("mess.existed");
        }
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['areacode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
            // $filters['areaname'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }
}