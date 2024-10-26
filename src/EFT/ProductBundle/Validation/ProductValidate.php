<?php
/**
 * Copyright (c) 2020 OVTeam
 * Modified date: 2020/02/07
 * Modified by: Bang Doan
 */

namespace EFT\ProductBundle\Validation;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ProductBundle\Lib\BizObject\Product;

class ProductValidate {

    /**
    * Validate data for create product
    */
    public static function createValidateData($bizObject)
    {
        $collection = $bizObject->getCollection();
        $data =  $bizObject->getDocument();

        if(!isset($data['sku']) || empty($data['sku'])){
            throw new \Exception("Vui lòng nhập mã SKU.");    
        }

        $count = $collection->count([
            'sku' => $data['sku'], 
            'isdeleted' => 0
        ]);
        
        if($count > 0) {
            throw new \Exception("Mã SKU này đã tồn tại trong hệ thống.Vui lòng kiểm tra lại");
        }

        if(!isset($data['productname']) || empty($data['productname'])){
            throw new \Exception("Vui lòng nhập tên sản phẩm.");    
        }

        if(!isset($data['industry']) || empty($data['industry'])) {
            throw new \Exception("Vui lòng chọn ngành hàng.");    
        }

        if(!isset($data['effectivedate']) || empty($data['effectivedate'])){
            throw new \Exception("Vui lòng chọn ngày hiệu lực sử dụng.");    
        }

        if(!isset($data['productnature']) || empty($data['productnature'])){
            throw new \Exception("Vui lòng nhập tính chất hàng hóa.");    
        }

        if(!isset($data['producttype']) || empty($data['producttype'])){
            throw new \Exception("Vui lòng nhập loại hàng hóa.");    
        }

        if(!isset($data['storagetype']) || empty($data['storagetype'])){
            throw new \Exception("Vui lòng nhập hình thức lưu trữ hàng hóa.");    
        }

        if(!isset($data['expireddatemethod']) || empty($data['expireddatemethod'])){
            throw new \Exception("Vui lòng nhập hình thức quản lý hạn sử dụng.");    
        }

        if(!isset($data['inventorymethod']) || empty($data['inventorymethod'])){
            throw new \Exception("Vui lòng nhập hình thức quản lý hàng hóa.");    
        }

        if(!isset($data['goodsmethod']) || empty($data['goodsmethod'])){
            throw new \Exception("Vui lòng nhập phương pháp quản lý hàng tồn kho.");    
        }
        
        if(isset($data['standardprice']) && !is_numeric($data['standardprice'])){
            throw new \Exception("Giá bán phải là số và ko lớn hơn 0");     
        }
    }

     /**
    * Validate data for update product
    */
    public static function updateValidateData($bizObject)
    {
        
        $data =  $bizObject->getDocument();

        if(empty($data['sku'])){
            throw new \Exception("Vui lòng nhập mã SKU.");    
        }             
      
        if(empty($data['productname'])){
            throw new \Exception("Vui lòng nhập tên sản phẩm.");    
        }

        if(empty($data['industry']) || empty($data['industry']->industrycode)){
            throw new \Exception("Vui lòng chọn ngành hàng.");    
        }

        if(empty($data['effectivedate'])){
            throw new \Exception("Vui lòng chọn ngày hiệu lực sử dụng.");    
        }

        if(empty($data['productnature'])){
            throw new \Exception("Vui lòng nhập tính chất hàng hóa.");    
        }

        if(empty($data['producttype'])){
            throw new \Exception("Vui lòng nhập loại hàng hóa.");    
        }

        if(empty($data['storagetype'])){
            throw new \Exception("Vui lòng nhập hình thức lưu trữ hàng hóa.");    
        }

        if(empty($data['expireddatemethod'])){
            throw new \Exception("Vui lòng nhập hình thức quản lý hạn sử dụng.");    
        }

        if(empty($data['inventorymethod'])){
            throw new \Exception("Vui lòng nhập hình thức quản lý hàng hóa.");    
        }

        if(empty($data['goodsmethod'])){
            throw new \Exception("Vui lòng nhập phương pháp quản lý hàng tồn kho.");    
        }      

        if(!empty($data['standardprice']) && !is_numeric($data['standardprice'])){
            throw new \Exception("Giá bán phải là số và lớn hơn 0");     
        }
    }

      /**
    * Validate data for update product
    */
    public static function delValidateData($bizObject)
    {       
        throw new \Exception("Bạn không có quyền thực hiện chức năng xóa này. Vui lòng thử lại sau !"); 
    }
}