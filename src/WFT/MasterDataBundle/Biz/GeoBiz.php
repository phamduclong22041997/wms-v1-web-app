<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/29
 * Modified by: Duy Huynh
 */

namespace WFT\MasterDataBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use WFT\MasterDataBundle\Lib\BizObject\GeoProvince;

class GeoBiz 
{
    /**
     * Get list Data
     */
    public static function getProvince($country = null)
    {
        $bizObject = new GeoProvince();
        $filters = ['IsDeleted' => 0];
        $_options = ['sort' => ['Id' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }
}