<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use EFT\NetworkingBundle\Lib\Configuration;

class AddressDistrictBiz {

    /**
     * Get room type
     */
    public static function getDistrictCombo($searchParams = array())
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

        $collection = self::getCollection();
        $cursor = $collection->find($filters, ['sort' => ['districtname' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['districtcode' => $item->districtcode, 'districtname' => $item->districtname];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_NETWORKING_ADDRESS_DISTRICT, Configuration::$CONNECTION);
    }
}