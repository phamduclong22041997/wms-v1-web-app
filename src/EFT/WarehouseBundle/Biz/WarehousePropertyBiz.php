<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/16
 * Modified by: Duy Huynh
 */

namespace EFT\WarehouseBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\WarehouseBundle\Lib\BizObject\WarehouseProperty;
use EFT\WarehouseBundle\Lib\BizObject\WarehousePropertyType;
use OVCore\MongoBundle\Lib\MongoDBManager;
use EFT\NetworkingBundle\Lib\Configuration;

class WarehousePropertyBiz {   

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new WarehouseProperty();
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
     * Get Warehouse Property Type
     */
    public static function getWarehousePropertyTypeCombo()
    {
        $bizObject = new WarehousePropertyType();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['name' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeData($item);;
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get Warehouse Property
     */
    public static function getWarehousePropertyCombo($searchParams)
    {
        $bizObject = new WarehouseProperty();
        $collection = $bizObject->getCollection();
        $filters = self::makeFilter($searchParams);

        $cursor = $collection->find($filters, ['sort' => ['propertyname' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeData($item);;
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get one data
     */
    public static function getOne($searchParams)
    {
        $bizObject = new WarehouseProperty();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new WarehouseProperty();
        $bizObject->loadDocument($data);

        if($bizObject->isNew()) {
            self::validate($bizObject);
        }
        if($bizObject->isRemove()) {
            self::checkPeristData($bizObject->getDocument());
        }
        if(!$bizObject->isRemove() && !$bizObject->isNew()) {
            self::updateToRelatedObject($bizObject->getDocument());
        }
        return $bizObject->save();
    }

    /**
     * Update Changes To Related Object
     */
    private static function updateToRelatedObject($data){
        $_data = is_object($data) ? clone($data) : $data;
        $unsetKey = ['isdeleted', '_id', 'lastmodified', 'createddate', 'modifiedby'];
        for($i = 0; $i < count($unsetKey); $i++){
            if(isset($_data[$unsetKey[$i]])){
                unset($_data[$unsetKey[$i]]);
            }
        }

        switch($_data['propertytype']['code']){
            case WarehousePropertyType::WAREHOUSE_TYPE :
                self::updateWarehouseType($_data);
                break;
            case WarehousePropertyType::WAREHOUSE_FUNCTION :
                self::updateWarehouseFunction($_data);
                break;
            case WarehousePropertyType::ROOM_TYPE :
                self::updateRoom($_data);
                break;
            case WarehousePropertyType::POINT_TYPE :
                self::updatePoint($_data);
                break;
            default: break;
        }
    }

    /**
     * Update Changes To Room
     */
    private static function updateRoom($data)
    {        
        $roomCollection = MongoDBManager::getCollection(Configuration::COLLECTION_ROOM, Configuration::$CONNECTION);
        $rooms = $roomCollection->find(['roomtype.propertycode' => $data['propertycode'], 'isdeleted' => 0]);
        if($rooms){
            foreach($rooms as $room){
                $roomCollection->updateOne(['roomcode' => ['$regex' => $room['roomcode'], '$options' => 'i'], 'isdeleted' => 0],
                ['$set' => ['roomtype' => $data]]);
            }
        }
    }

    /**
     * Update Changes To Point
     */
    private static function updatePoint($data)
    {
        $pointCollection = MongoDBManager::getCollection(Configuration::COLLECTION_POINT, Configuration::$CONNECTION);
        $points = $pointCollection->find(['pointtype.propertycode' => ['$regex' => $data['propertycode'], '$options' => 'i'], 'isdeleted' => 0]);
        if($points){
            foreach($points as $point){
                $pointCollection->updateOne(['pointcode' => ['$regex' => $point['pointcode'], '$options' => 'i'],
                'pointtype.propertycode' => ['$regex' => $data['propertycode'], '$options' => 'i'],
                'isdeleted' => 0],
                ['$set' => ['pointtype' => $data]]);
            }
        }
    }

    /**
     * Update Changes To WarehouseType
     */
    private static function updateWarehouseType($data)
    {
        $warehouseCollection = MongoDBManager::getCollection(\EFT\WarehouseBundle\Lib\Configuration::COLLECTION_WAREHOUSE, Configuration::$CONNECTION);
        $warehouses = $warehouseCollection->find(['warehousetype.propertycode' => ['$regex' => $data['propertycode'], '$options' => 'i'], 'isdeleted' => 0]);
        if($warehouses){
            foreach($warehouses as $warehouse){
                $warehouseCollection->updateOne(['warehousecode' => $warehouse['warehousecode'], 'isdeleted' => 0],
                ['$set' => ['warehousetype' => $data]]);
            }
        }
    }

    /**
     * Update Changes To WarehouseFunction
     */
    private static function updateWarehouseFunction($data)
    {
        $warehouseCollection = MongoDBManager::getCollection(\EFT\WarehouseBundle\Lib\Configuration::COLLECTION_WAREHOUSE, Configuration::$CONNECTION);
        $warehouses = $warehouseCollection->find(['warehousefunction.propertycode' =>['$regex' => $data['propertycode'],'$options' => 'i'], 'isdeleted' => 0]);
        if($warehouses){ 
            foreach($warehouses as $warehouse){
                $warehouseCollection->updateOne(['warehousecode' => ['$regex' => $warehouse['warehousecode'], '$options' => 'i'], 'isdeleted' => 0],
                ['$set' => ['warehousefunction' => $data]]);
            }
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
            'propertycode' => $document['propertycode'],
            'isdeleted' => 0
        ]);
        if($count > 0) {
            throw new \Exception("Mã tính chất kho đã tồn tại trong hệ thống.  Vui lòng nhập lại.");
        }
    }

    /**
     * Nếu kho đã sử dụng thi quăng ngoại lê - Mã kho đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        if(isset($obj->isused) && $obj->isused){
            throw new \Exception('Mã tính chất kho đã sử dụng trong hệ thống. Không thể xóa');
        }
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = [];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['propertycode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        if (isset($searchParams['filter']) && $searchParams['filter']) {
            if (isset($searchParams['filter']['propertytype'])) {
                $filters['propertytype.type'] = $searchParams['filter']['propertytype'];
            }
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }
}