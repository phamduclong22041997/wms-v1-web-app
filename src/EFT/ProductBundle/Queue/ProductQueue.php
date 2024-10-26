<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/02/05
 * Modified by: Bang Doan
 */

namespace EFT\ProductBundle\Queue;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\PurchaseOrderBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\QueueBundle\Lib\UserActionManager;


class ProductQueue {

   /**
     * Push to create product queue
     */
  public static function saveProductQueue($data){
    //Before push queue
    $codeName = isset($data['ref']) ? 'CẬP NHẬT SẢN PHẨM ' : 'TẠO MỚI SẢN PHẨM ';
    $codeName = isset($data['isdeleted']) ? 'XÓA SẢN PHẨM '  : $codeName;
    //Push to queue   
    $result = UserActionManager::pushToQueue(array(
        'data'          => [$data],
        'cls'           =>'\EFT\ProductBundle\Biz\ProductBiz',
        'method'        => 'save',
        'export'        => '',
        'requesttype'   => 'save_product',
        'requestcode'   => $codeName.'SKU ['.$data['sku'].'].',
        'filters'       => null    
    ));

    //After queue
    return $result;
  }

}