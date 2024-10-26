<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\C3PLBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use OVCore\MongoBundle\Lib\Utils;
use OVCore\UtilityBundle\Lib\Utility;
use WFT\C3PLBundle\Lib\BizObject\C3PL;
use WFT\C3PLBundle\Validation\C3PLValidate;

class C3PLBiz 
{
    /**
     * Get Combo Data
     */
    public static function getComboData()
    {
        $bizObject = new C3PL();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['IsDeleted' => 0], ['sort' => ['Code' => 1]]);
        $data = array(
            'Rows'  => [],
            'Total' => 0
        );

        foreach ($cursor as $item) {
            $data['Rows'][] = array(
                'Id'   => $item['Id'],
                'Code' => $item['Code'],
                'Name' => $item['Name']
            ); // $bizObject->makeData($item);
            $data['Total'] += 1;
        }
        return $data;
    }

    /**
     * Get list Data
     */
    public static function getList($searchParams)
    {
        $bizObject = new C3PL();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters, $searchParams);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $dataItem                         = $bizObject->makeData($doc);
            $dataItem['Idx']                  = ++$from;
            $data[] = $dataItem;
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Get One Data
     */
    public static function getOne($Id)
    {
        $bizObject = new C3PL();
        $bizObject->loadDocument(['Id' => $Id]);
        return $bizObject->makeData();
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['IsDeleted' => 0];

        if (isset($searchParams['filter'])) {
            $params = $searchParams['filter'];
            if (isset($params['Code'])) {
                $filters['Code'] =  $params['Code'];
            }
        }
        return $filters;
    }
}