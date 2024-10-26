<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/02/05
 * Modified by: Bang Doan
 */

namespace EFT\PurchaseOrderBundle\Queue;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\PurchaseOrderBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\QueueBundle\Lib\UserActionManager;
use EFT\PurchaseOrderBundle\Validation\PurchaseOrderValidate;

class PurchaseOrderQueue {

   /**
     * Push to create purchase order queue
     */
  public static function createPOQueue($data){
    
    /*--Get queue info--*/
    $queueInfo = self::implementQueueIno($data);

    /*--Validate before Push To Queue--*/
    self::validate($queueInfo['action'], $data);
    
    /*--Push to Queue--*/
    $result = UserActionManager::pushToQueue(array(
        'data'          => [$data],
        'cls'           =>'\EFT\PurchaseOrderBundle\Biz\PurchaseOrderBiz',
        'method'        => 'save',
        'export'        => '',
        'requesttype'   => 'save_po',
        'requestcode'   => $queueInfo['code'],
        'filters'       => null    
    ));

    //After queue
    return $result;
  }

  /**
     * Get info to decide type of queue and validate
     */
  private static function implementQueueIno($data)
  {
      $codeName = 'TẠO MỚI ĐƠN NHẬP HÀNG ';
      $action = 'create';

      if($data['ref'])
      {
        $codeName = 'CẬP NHẬT ĐƠN NHẬP HÀNG ';
        $action = 'update';   
      }

      if(isset($data['isdeleted']) && $data['isdeleted'] == 1)
      {
        $codeName = 'XÓA ĐƠN NHẬP HÀNG ';
        $action = 'del'; 
      }

      return ['action'=>$action, 'code' =>  $codeName];

  }

  /**
     * Navigate to validate function
     */
  private static function validate($action,$data)
  {      
     $fnc = strtolower($action).'ValidateData';
     PurchaseOrderValidate::$fnc($data); 
     
  }

}