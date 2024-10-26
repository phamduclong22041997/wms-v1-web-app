<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use EFT\NetworkingBundle\Lib\Configuration;

class AddressWardBiz {

    /**
     * Get room type
     */
    public static function getWardCombo($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if(!empty($searchParams['country'])) {
            $filters['country.countrycode'] = $searchParams['country'];
        }
        if(!empty($searchParams['region'])) {
            $filters['region.regioncode'] = $searchParams['region'];
        }
        if(!empty($searchParams['province'])) {
            $filters['province.provincecode'] = $searchParams['province'];
        }
        if(!empty($searchParams['city'])) {
            $filters['city.citycode'] = $searchParams['city'];
        }
        if(!empty($searchParams['district'])) {
            $filters['district.districtcode'] = $searchParams['district'];
        }

        $collection = self::getCollection();
        $cursor = $collection->find($filters, ['sort' => ['wardname' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['wardcode' => $item->wardcode, 'wardname' => $item->wardname];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_NETWORKING_ADDRESS_WARD, Configuration::$CONNECTION);
    }
}