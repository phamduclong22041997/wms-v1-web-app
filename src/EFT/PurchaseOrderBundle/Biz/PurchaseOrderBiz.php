<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/01/13
 * Modified by: Duy Huynh
 */

namespace EFT\PurchaseOrderBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\PurchaseOrderBundle\Lib\BizObject\PurchaseOrder;
use EFT\PurchaseOrderBundle\Lib\BizObject\PurchaseOrderType;
use OVCore\UtilityBundle\Lib\Utility;
use EFT\PurchaseOrderBundle\Validation\PurchaseOrderValidate;

class PurchaseOrderBiz {
    

    /**
     * Get Warehouse Position
     */
    public static function getPOTypeCombo()
    {
        $bizObject = new PurchaseOrderType();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['code' => 1]]);
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
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new PurchaseOrder();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters ,$searchParams);
        $data = [];
        $from = $result['start'];
        foreach($result['cursor'] as $doc) {
            $dataItem                           = $bizObject->makeData($doc);                 
            $dataItem['index']                  = ++$from;                 
            //unset($dataItem['items']);
            $data[] = $dataItem;
        }
        return array(
            'rows'  => $data,
            'total' => $result['total']
        );
    }

     /**
     * Create PO
     */

     public static function save($data)
     { 
        $bizObject = new PurchaseOrder();                          
        $bizObject->loadDocument($data);            
        self::validate($bizObject->getAction(),$data);
        return $bizObject->save();
     }
    


    public static function getOne($searchParams)
    {
        $bizObject = new PurchaseOrder();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }
  

    /**
     * Validate
     */
    

    /**
     * Nếu kho đã sử dụng thi quăng ngoại lê - Mã kho đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        return true;
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['pocode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }

        if(isset($searchParams['filter'])) {           
            $params = $searchParams['filter'];                 
            if(isset($params['pocode']) && !empty(trim($params['pocode']))){                
                 $filters['pocode'] = ['$regex' => trim($params['pocode']), '$options' => 'i'];       
            } 
         }  
        return $filters;
    }

    
    /**
     * Navigate validate data
     */
    private static function validate($action,$data)
    {
        
       $fnc = strtolower($action).'ValidateData';
       PurchaseOrderValidate::$fnc($data); 
       
    }
}