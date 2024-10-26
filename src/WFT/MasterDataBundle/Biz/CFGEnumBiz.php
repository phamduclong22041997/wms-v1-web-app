<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\MasterDataBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use WFT\MasterDataBundle\Lib\BizObject\CFGEnum;

class CFGEnumBiz 
{
    /**
     * Get list Status
     */
    public static function getStatusByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'STATUS');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Get list Claim Status
     */
    public static function getClaimStatusByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'STATUS');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Get list Claim Status
     */
    public static function getSupplyStatusByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'STATUS');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

     /**
     * Get list Masan Store Status
     */
    public static function getMasanStoreStatusByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'STATUS');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

      /**
     * Get list Masan Store Status
     */
    public static function getMasanOfferTypeByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'OFFERTYPE');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

     /**
     * Get list Claim Kind
     */
    public static function getClaimKindByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'KIND');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

      /**
     * Get list Claim Withdrawal Type
     */
    public static function getClaimWithDrawalTypeByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'WITHDRAWALTYPE');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Get list Status Assign Storage
     */
    public static function getStatusAssignStorageByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'STATUS');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Get list Data
     */
    public static function getPicklistMethodByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'PROPERTY');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Get list Config
     */
     public static function getConfigByModule($moduleId)
     {
         $bizObject = new CFGEnum();
         $filters = self::makeFilter($moduleId, 'CFG');
         $_options = ['sort' => ['Order' => 1]];
         $data = [];
         $collection = $bizObject->getCollection();
         $cursor = $collection->find($filters, $_options);
         foreach ($cursor as $doc) {
             $data[] = $bizObject->makeData($doc);
         }
         return array(
             'Rows'  => $data,
             'Total' => $result['total']
         );
     }

     /**
     * Get BizType List
     */
    public static function getBizTypeByModule($moduleId)
    {
        $bizObject = new CFGEnum();
        $filters = self::makeFilter($moduleId, 'PROPERTY');
        $_options = ['sort' => ['Order' => 1]];
        $data = [];
        $collection = $bizObject->getCollection();
        $cursor = $collection->find($filters, $_options);
        foreach ($cursor as $doc) {
            $data[] = $bizObject->makeData($doc);
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Make request filters
     */
    private static function makeFilter($moduleId, $type="STATUS")
    {
        $filters = [
            'IsDeleted' => 0, 
            'Module'    => $moduleId,
            'Type'      => $type
        ];
        if($type != 'CFG') {
            $filters['Language'] = \OVCore\SecurityBundle\Lib\Config::$locale;
        }
        return $filters;
    }
}