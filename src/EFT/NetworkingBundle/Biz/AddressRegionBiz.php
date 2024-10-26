<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\NetworkingBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class AddressRegionBiz {

    /**
     * Get Region
     */
    public static function getRegionCombo($country = null)
    {
        $filters = ['isdeleted' => 0];
        if(!empty($country)) {
            $filters['country.countrycode'] = $country;
        }
        $collection = self::getCollection();
        $cursor = $collection->find($filters, ['sort' => ['regionname' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['regioncode' => $item->regioncode, 'regionname' => $item->regionname];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult(self::getCollection(), $filters ,$searchParams);
        $data = [];
        $from = $result['start'];
        foreach($result['cursor'] as $doc) {
            $dataItem = self::makeData($doc);
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
        if(!isset($searchParams['regioncode'])) {
            throw new \Exception('mess.region.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['regioncode' => $searchParams['regioncode'], 'isdeleted' => 0]);
        if($obj == null) {
            throw new \Exception('mess.region.notfound');
        }
        return self::makeData($obj);
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $ref = $data['ref']??"";
        $isNew = true;
        $result = null;
        $collection = self::getCollection();

        if($ref == "") {
            self::validate($data);
            $persist = new Document();
        } else {
            $isNew = false;
            $persist = $collection->findOne(['regioncode' => $ref, 'isdeleted' => 0]);
        }
        if($persist != null) {            
            $persist->grantData($data);
            $persist->regionname = trim($data['regionname']);
            if($isNew) {
                $result = (string)$collection->insertOne($persist)
                                     ->getInsertedId();
            } else {
                if(isset($data['isdeleted'])) {
                    if(isset($persist->isused) && $persist->isused){
                        throw new \Exception('Mã vùng đã sử dụng trong hệ thống. Không thể xóa');
                    }
                    $persist->isdeleted = $data['isdeleted'];                    
                }
                $collection->updateOne(
                    ['regioncode' => $ref, 'isdeleted' => 0],
                    ['$set' => $persist]
                );
                $result = (string)$persist['_id'];
            }
        }
        return $result;
    }

    /**
     * Validate
     */
    private static function validate($data)
    {
        $collection = self::getCollection();
        $count = $collection->count(['regioncode' => $data['regioncode'], 'isdeleted' => 0]);
        if($count > 0) {
            throw new \Exception("Mã Vùng  đã tồn tại trong hệ thống. Vui lòng nhập lại");
        }
    }

    /**
     * Make response data
     */
    private static function makeData($doc)
    {
        return array(
            'regioncode'  => $doc->regioncode,
            'regionname'  => $doc->regionname,
            'country'     => $doc->country,
            'isused'      => $doc->isused ?? false
        );
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = [];
        if(isset($searchParams['filter']['regioncode']) && trim($searchParams['filter']['regioncode'])) {
            $filters['regioncode'] = ['$regex' => $searchParams['filter']['regioncode'], '$options' => 'i'];
        }
        if(isset($searchParams['filter']['countrycode']) && trim($searchParams['filter']['countrycode'])) {
            if (isset($searchParams['filter']['countrycode']) && trim($searchParams['filter']['countrycode'])) {
                $filters['country.countrycode'] = $searchParams['filter']['countrycode'];
            }
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_NETWORKING_ADDRESS_REGION, Configuration::$CONNECTION);
    }
}