<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\MasterDataBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use OVCore\MongoBundle\Lib\Utils;
use OVCore\UtilityBundle\Lib\Utility;
use WFT\MasterDataBundle\Lib\BizObject\MasterData;
use WFT\MasterDataBundle\Validation\MasterDataValidate;
use WFT\MasterDataBundle\Lib\WMSStorageEquipment;
use WFT\MasterDataBundle\Lib\WMSEmployee;
use WFT\MasterDataBundle\Lib\BizObject\WFTWarehouse;

class MasterDataBiz 
{
    /**
     * Get Storage Equipment
     */
    public static function getEmployee()
    {
        $resp = WMSEmployee::getEmployee();
        return ['Rows' => $resp];
    }

    /**
     * Get Warehouse
     */
    public static function getWarehouse()
    {
        $bizObject = new WFTWarehouse();
        $filters = ['IsDeleted' => 0];
        $_options = ['sort' => ['Id' => 1]];
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
     * Get Storage Equipment
     */
    public static function getStorageEquipment($content)
    {
        $resp = WMSStorageEquipment::getStorageEquipment($content);
        return ['Rows' => $resp];
    }

    /**
     * Check Storage Equipment
     */
    public static function checkStorageEquipment($content)
    {
        $resp = WMSStorageEquipment::checkStorageEquipment($content);
        return ['Rows' => $resp];
    }

    /**
     * Update Storage Equipment
     */
    public static function updateStorageEquipment($content)
    {
        $resp = WMSStorageEquipment::updateStorageEquipment($content);
        return ['Rows' => $resp];
    }

    /**
     * Get list Data
     */
    public static function getList($searchParams)
    {
        $bizObject = new MasterData();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters, $searchParams);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $dataItem                         = $bizObject->makeData($doc);
            $dataItem['Idx']                  = ++$from;
            $data[] = $dataItem;
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['IsDeleted' => 0];

        if (isset($searchParams['filter'])) {
            $params = $searchParams['filter'];
            if (isset($params['Code'])) {
                $filters['Code'] =  $params['Code'];
            }
        }
        return $filters;
    }
}