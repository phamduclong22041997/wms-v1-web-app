<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/18s
 * Modified by: Duy Huynh
 */

namespace EFT\ProductBundle\Biz;
use OVCore\MongoBundle\Lib\Utils;
use EFT\ProductBundle\Lib\BizObject\ProductConfigurationAttachedService;
use EFT\ProductBundle\Lib\BizObject\ProductConfigurationServiceType;

class ProductConfigurationAttachedServiceBiz {

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new ProductConfigurationAttachedService();
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
        $bizObject = new ProductConfigurationAttachedService();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new ProductConfigurationAttachedService();
        $bizObject->loadDocument($data);

        if($bizObject->isNew()) {
            self::validate($bizObject);
        }
        if($bizObject->isRemove()) {
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
            'servicecode' => new \MongoDB\BSON\Regex("^".$document['servicecode']."$", 'i'), 
            'isdeleted' => 0
        ]);
        if($count > 0) {
            throw new \Exception("mess.existed");
        }
    }

    /**
     * Nếu kho đã sử dụng thi quăng ngoại lê - Mã kho đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        if(isset($obj->isused) && $obj->isused){
            throw new \Exception('Mã dịch vụ đã sử dụng trong hệ thống. Không thể xóa');
        }
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = [];
        if(isset($searchParams['filter'])) {
            if(isset($searchParams['filter']['servicecode']) && trim($searchParams['filter']['servicecode'])) {
                $filters['servicecode'] = ['$regex' => $searchParams['filter']['servicecode'], '$options' => 'i'];
            }
            if (isset($searchParams['filter']['servicetype']) && trim($searchParams['filter']['servicetype'])) {
                $filters['servicetype.servicetypename'] = $searchParams['filter']['servicetype'];
            }
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }

    /**
     * Get Service Type combo
     */
    public static function getServiceTypeCombo($serviceType = "")
    {
        $bizObject = new ProductConfigurationServiceType();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['type' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeData($item);
            $data['total'] += 1;
        }
        return $data;
    }

    
    /**
     * Get Service list by type
     */
    public static function getService($serviceType = "")
    {
        $bizObject = new ProductConfigurationAttachedService();
        $collection = $bizObject->getCollection();
        $params = ['isdeleted' => 0];      
        if(!empty($serviceType))
        {
            $params['servicetype.servicetypecode'] = strval($serviceType);
        }
        $cursor = $collection->find($params, ['sort' => ['type' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        $index = 0;
        foreach($cursor as $item) {
            $index++;
            $data['rows'][] = array(
                'code'          => $item->servicecode,
                'service'       => $item->servicename,
                'service_en'    => $item->servicename_en,
                'index'         => $index
            );           
            $data['total'] += 1;
        }
        return $data;
    }
}