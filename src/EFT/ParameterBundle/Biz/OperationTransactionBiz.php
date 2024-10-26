<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/16
 * Modified by: Duy Huynh
 */

namespace EFT\ParameterBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ParameterBundle\Lib\BizObject\OperationTransactionType;
use EFT\ParameterBundle\Lib\BizObject\OperationTransaction;

class OperationTransactionBiz
{

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new OperationTransaction();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters, $searchParams);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
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
    public static function getTransactionTypeCombo($ref = "")
    {
        $bizObject = new OperationTransaction();
        $collection = $bizObject->getCollection();
        if ($ref) {
            $cursor = $collection->find(['ref' => $ref, 'isdeleted' => 0], ['sort' => ['code' => 1]]);
        } else {
            $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['code' => 1]]);
        }
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach ($cursor as $item) {
            $data['rows'][] = $bizObject->makeData($item);
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get Warehouse Position
     */
    public static function getPOTransactionTypeCombo()
    {
        $bizObject = new OperationTransaction();
        $collection = $bizObject->getCollection();
        $cursor = $collection->find(['operationobject.code' => '09', 'isdeleted' => 0], ['sort' => ['code' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach ($cursor as $item) {
            $data['rows'][] =   array(
                'code'     => $item->code,
                'name'     => $item->name,
                'name_en'  => $item->name_en,
            );
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get one data
     */
    public static function getOne($searchParams)
    {
        $bizObject = new OperationTransaction();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new OperationTransaction();
        $bizObject->loadDocument($data);

        if ($bizObject->isNew()) {
            self::validate($bizObject);
        }
        if ($bizObject->isRemove()) {
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
            'operationobject.code'          => $document['operationobject']['code'],
            'transactiontype.code'          => $document['transactiontype']['code'],
            'code'                          => new \MongoDB\BSON\Regex("^" . $document['code'] . "$", 'i'),
            'isdeleted'                     => 0
        ]);
        if ($count > 0) {
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
        if (isset($searchParams['filter']['code']) && trim($searchParams['filter']['code'])) {
            $filters['code'] = ['$regex' => $searchParams['filter']['code'], '$options' => 'i'];
        }

        if (isset($searchParams['filter']['operationobject']) && trim($searchParams['filter']['operationobject'])) {
            $filters['operationobject.code'] = ['$regex' => $searchParams['filter']['operationobject'], '$options' => 'i'];
        }
        if (isset($searchParams['filter']['transactiontype']) && trim($searchParams['filter']['transactiontype'])) {
            $filters['transactiontype.code'] = ['$regex' => $searchParams['filter']['transactiontype'], '$options' => 'i'];
        }
        return $filters;
    }
}
