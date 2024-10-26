<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use EFT\NetworkingBundle\Lib\Configuration;

class AddressProvinceBiz {

    /**
     * Get room type
     */
    public static function getProvinceCombo($searchParams = array())
    {
        $filters = ['isdeleted' => 0];

        if(isset($searchParams['country']) && !empty($searchParams['country'])) {
            $filters['country.countrycode'] = $searchParams['country'];
        }

        if(isset($searchParams['region']) && !empty($searchParams['region'])) {
            $filters['region.regioncode'] = $searchParams['region'];
        }
        $collection = self::getCollection();
        $cursor = $collection->find($filters, ['sort' => ['provincename' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['provincecode' => $item->provincecode, 'provincename' => $item->provincename];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_NETWORKING_ADDRESS_PROVINCE, Configuration::$CONNECTION);
    }
}