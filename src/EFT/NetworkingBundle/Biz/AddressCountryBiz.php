<?php

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\NetworkingBundle\Lib\BizObject\AddressCountry;
use OVCore\MongoBundle\Lib\MongoDBManager;
use EFT\NetworkingBundle\Lib\Configuration;

class AddressCountryBiz {

    /**
     * Get room type
     */
    public static function getCountryCombo()
    {
        $bizObject = new AddressCountry();
        $collection = $bizObject->getCollection();
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['countrycode' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['countrycode' => $item->countrycode, 'countryname' => $item->countryname];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new AddressCountry();
        $filters = self::makeFilter($searchParams);
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
     * Get one data
     */
    public static function getOne($searchParams)
    {
        $bizObject = new AddressCountry();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new AddressCountry();
        $bizObject->loadDocument($data);

        if($bizObject->isNew()) {
            self::validate($bizObject);
        }
        if($bizObject->isRemove()) {
            self::checkPeristData($bizObject->getDocument());
        }
        if(!$bizObject->isRemove()){
            self::updateToRegion($bizObject->getDocument());
        }
        return $bizObject->save();
    }

    private static function updateToRegion($data)
    {
        $regionCollection = MongoDBManager::getCollection(Configuration::COLLECTION_NETWORKING_ADDRESS_REGION, Configuration::$CONNECTION);
        $regions = $regionCollection->find(['country.countrycode' => $data['countrycode'], 'isdeleted' => 0]);
        if($regions) {
            foreach($regions as $region){
                $regionCollection->updateOne(
                    ['regioncode' => $region['regioncode'], 'isdeleted' => 0],
                    ['$set' => ['country' => ['countrycode' => $data['countrycode'],
                     'countryname' => $data['countryname']]]]
                );
            }
        }
    }

    /**
     * Nếu quốc gia đã sử dụng thi quăng ngoại lê - Mã quốc gia đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        $regionCollection = MongoDBManager::getCollection(Configuration::COLLECTION_NETWORKING_ADDRESS_REGION, Configuration::$CONNECTION);
        $region = $regionCollection->count(['country.countrycode' => $obj['countrycode'], 'isdeleted' => 0]);
        if($region > 0) {
            throw new \Exception('Mã quốc gia đã sử dụng trong hệ thống. Không thể xóa');
        }
    }

    /**
     * Validate
     */
    private static function validate($bizObject)
    {
        $collection = $bizObject->getCollection();
        $document = $bizObject->getDocument();
        $count = $collection->count([
            'countrycode' => new \MongoDB\BSON\Regex("^".$document['countrycode']."$", 'i'), 
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
        $filters = [];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['countrycode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }
}