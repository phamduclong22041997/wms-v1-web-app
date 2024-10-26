<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use EFT\NetworkingBundle\Lib\Configuration;

class AddressCityBiz {

    /**
     * Get room type
     */
    public static function getCityCombo($searchParams = array())
    {
        $filters = [
            'isdeleted' => 0,
            'istw'      => $searchParams['istw'] || false
        ];
        // $filters['country.countrycode']     = $searchParams['country'];
        // $filters['region.regioncode']       = $searchParams['region'];
        // $filters['province.provincecode']   = $searchParams['province'];
        if(!empty($searchParams['country'])) {
            $filters['country.countrycode'] = $searchParams['country'];
        }
        if(!empty($searchParams['region'])) {
            $filters['region.regioncode'] = $searchParams['region'];
        }

        $collection = self::getCollection();
        $cursor = $collection->find($filters, ['sort' => ['cityname' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['citycode' => $item->citycode, 'cityname' => $item->cityname, 'istw'=> $item->istw];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_NETWORKING_ADDRESS_CITY, Configuration::$CONNECTION);
    }
}