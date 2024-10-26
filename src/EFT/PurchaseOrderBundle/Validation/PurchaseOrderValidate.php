<?php
/**
 * Copyright (c) 2020 OVTeam
 * Modified date: 2020/02/07
 * Modified by: Bang Doan
 */

namespace EFT\PurchaseOrderBundle\Validation;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ProductBundle\Lib\BizObject\Product;

class PurchaseOrderValidate {

    /**
    * Validate data for create PO
    */
    public static function createValidateData($data)
    {            
        if(!isset($data['contact']) || empty($data['contact'])){
            throw new \Exception("mess.require.contact");    
        }

        if(!isset($data['phonenumber']) || empty($data['phonenumber'])){
            throw new \Exception("mess.require.phone");    
        }       
      
      
        if(!isset($data['sourcewarehouse']) || empty($data['sourcewarehouse']) || !isset($data['sourcewarehouse']['warehousecode']) || empty($data['sourcewarehouse']['warehousecode'])){
            throw new \Exception("mess.require.sourcewarehouse");    
        }

        if(!isset($data['destinationwarehouse']) || empty($data['destinationwarehouse']) || !isset($data['destinationwarehouse']['warehousecode']) || empty($data['destinationwarehouse']['warehousecode'])){
            throw new \Exception("mess.require.destinationwarehouse");    
        }

        if(isset($data['potype']) && !empty($data['potype']) && $data['potype'] == 'NORMAL' && $data['destinationwarehouse']['warehousecode'] != $data['sourcewarehouse']['warehousecode']){
            throw new \Exception("mess.difference.warehouse");    
        }

        if(!isset($data['items']) ||  empty($data['items'])){
            throw new \Exception("mess.require.item");
        }        
    }

     /**
    * Validate data for update PO
    */
    public static function updateValidateData($data)
    {
    
        if(isset($data['contact']) && empty($data['contact'])){
            throw new \Exception("mess.require.contact");       
        }      

        if(isset($data['phonenumber']) && empty($data['phonenumber'])){
            throw new \Exception("mess.require.phone");    
        }

        if(isset($data['sourcewarehouse']) && empty($data['sourcewarehouse']) || (isset($data['sourcewarehouse']['warehousecode']) && empty($data['sourcewarehouse']['warehousecode']))){
            throw new \Exception("mess.require.sourcewarehouse");    
        }

        if(isset($data['destinationwarehouse']) && empty($data['destinationwarehouse']) || !isset($data['destinationwarehouse']['warehousecode']) || empty($data['destinationwarehouse']['warehousecode'])){
            throw new \Exception("mess.require.destinationwarehouse");    
        }

        if(isset($data['potype']) && !empty($data['potype']) && $data['potype'] == 'NORMAL' && $data['destinationwarehouse']['warehousecode'] != $data['sourcewarehouse']['warehousecode']){
            throw new \Exception("mess.difference.warehouse");    
        }

        if(isset($data['items']) &&  empty($data['items'])){
            throw new \Exception("mess.require.item");
        }     
    }

      /**
    * Validate data for delete PO
    */
    public static function delValidateData($data)
    {       
        throw new \Exception("mess.notpermitted"); 
    }
}