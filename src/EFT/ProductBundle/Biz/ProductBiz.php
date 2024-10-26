<?php
/**
 * Copyright (c) 2020 OVTeam
 * Modified date: 2020/02/07
 * Modified by: Bang Doan
 */

namespace EFT\ProductBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ProductBundle\Lib\BizObject\Product;
use EFT\ProductBundle\Validation\ProductValidate;


class ProductBiz {

    /**
     * Get list
     */
    public static function getList($searchParams)
    {        
        $bizObject = new Product();
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
        $bizObject = new Product();
        $bizObject->loadDocument($searchParams);
        return $bizObject->makeData();
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new Product();            
        $bizObject->loadDocument($data);            
        self::validate($bizObject);         
        return $bizObject->save();
    }
    
    /**
     * Create/Update data
     */
    public static function checkSku($sku)
    {       
        $bizObject = new Product(); 
        $collection = $bizObject->getCollection();
        $product = $collection->findOne(['sku' => strtoupper(trim($sku)), 'isdeleted' => 0]);
        if(!$product)
        {
            throw new \Exception("SKU này không tồn tại trong hệ thống. Vui lòng kiểm tra lại");
        }
       
        if($product['status']!== $bizObject::STATUS_ACTIVE)
        {
            throw new \Exception("SKU này không sử dụng trong hệ thống. Vui lòng kiểm tra lại");
        }

        return array('sku'=> $product['sku'], 'productname' => $product['productname']);
        
    }
   
    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        
        $filters = ['isdeleted' => 0];
        if(isset($searchParams['keyword']) && trim($searchParams['keyword'])) {           
            $filters['sku'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];            
        }
        if(isset($searchParams['filter'])) {           
           $params = $searchParams['filter'];                 
           if(isset($params['sku']) && !empty(trim($params['sku']))){                
                $filters['sku'] = ['$regex' => trim($params['sku']), '$options' => 'i'];       
           }

           if(isset($params['status']) && !empty(trim($params['status']))){   
                $filters['status'] = trim($params['status']);                   
           }

           if(isset($params['industry']) && !empty(trim($params['industry']))){              
            $filters['industry.industrycode'] = trim($params['industry']);                   
           }         
                      
           if(isset($params['producttype']) && !empty(trim($params['producttype']))){              
                $filters['producttype.code'] = trim($params['producttype']);                   
           }

           if(isset($params['storagetype']) && !empty(trim($params['storagetype']))){              
                $filters['storagetype.code'] = trim($params['storagetype']);                   
           }

           if(isset($params['expireddatemethod']) && !empty(trim($params['expireddatemethod']))){              
                $filters['expireddatemethod.code'] = trim($params['expireddatemethod']);                   
           }
        }  
        //var_dump($filters);    
        return $filters;
    }
 
      /**
     * Navigate validate data
     */
    private static function validate($bizObject)
    {
        
       $fnc = strtolower($bizObject->getAction()).'ValidateData';
       ProductValidate::$fnc($bizObject); 
       
    }
}