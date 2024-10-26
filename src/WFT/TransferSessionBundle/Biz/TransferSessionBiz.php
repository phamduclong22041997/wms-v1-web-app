<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh, Huy Nghiem
 */

namespace WFT\TransferSessionBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use OVCore\UtilityBundle\Lib\Utility;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use WFT\TransferSessionBundle\Lib\BizObject\TransferSession;
use WFT\TransferSessionBundle\Lib\BizObject\TransferSessionPackage;
use WFT\TransferSessionBundle\Lib\BizObject\TransferSessionProduct;
use WFT\TransferSessionBundle\Validation\TransferSessionDetailValidate;
use WFT\TransferSessionBundle\Lib\WMSPackage;
use WFT\TransferSessionBundle\Lib\WMSProduct;
use WFT\TransferSessionBundle\Lib\WMSClient;

class TransferSessionBiz
{

    /**
     * Get Packages From WMS
     */
    public static function getClients($searchParams)
    {
        $resp = WMSClient::getClients($searchParams);
        return ['Rows' => $resp];
    }

    /**
     * Get Packages From WMS
     */
    public static function getWMSPackages($searchParams)
    {
        $resp = WMSPackage::getPackages($searchParams);
        return ['Rows' => $resp];
    }

    /**
     * Get Product From WMS
     */
    public static function getWMSProducts($searchParams)
    {
        $resp = WMSProduct::getProducts($searchParams);
        return ['Rows' => $resp];
    }

    /**
     * Get Transfer Session
     */
    public static function getOne($Code)
    {
        $bizObject = new TransferSession();
        $document = $bizObject->getCollection()->findOne(['TransferSessionCode' => $Code]);
        if($document == null) {
            throw new \Exception("Data not found.");
        }
        $document['StatusText'] = Utility::$translator->trans("transfersession.status.".$document['Status']);
        $document['Id'] = (string)$document->_id;
        return $bizObject->makeData($document, [
            'Id'                   => true,
            'TransferSessionCode'   => true,
            'WarehouseId'           => true,
            'ClientId'              => true,
            'C3PLId'                => true,
            'C3PLCode'              => true,
            'C3PLName'              => true,
            'Status'                => true,
            'StatusText'            => true,
            'ReceivedDate'          => true,
            'Content'               => true
        ]);
    }

    /**
     * Get Packages from Transfer Session
     */
    public static function getTransferSessionPackages($filters)
    {
        $bizObject = new TransferSessionPackage();
        $result = Utils::paginationResult($bizObject->getCollection(), $filters);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $doc['Id'] = (string)$doc->_id;
            $dataItem                   = $bizObject->makeData($doc, [
                'Id'                    => true,
                'ClientId'              => true,
                'ClientName'            => true,
                'EtonCode'              => true,
                'ExternalCode'          => true,
                'PackageNo'             => true,
                'TrackingCode'          => true,
                'Status'                => true,
                'Note'                  => true
            ]);
            $dataItem['Status']     = Utility::$translator->trans("package.status.".$dataItem['Status']);
            $dataItem['Idx']            = ++$from;
            $data[] = $dataItem;
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Get Products from Transfer Session
     */
    public static function getTransferSessionProducts($filters)
    {
        $bizObject = new TransferSessionProduct();
        $result = Utils::paginationResult($bizObject->getCollection(), $filters);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $doc['Id'] = (string)$doc->_id;
            $dataItem                   = $bizObject->makeData($doc, [
                'Id'                    => true,
                'EtonCode'              => null,
                'ExternalCode'          => null,
                'PackageNo'             => null,
                'TrackingCode'          => null,
                'Barcode'               => null,
                'Name'                  => null,
                'SSN'                   => null,
                'SKU'                   => null,
                'Status'                => null,
                'Note'                  => null,
                'UnitType'              => null,
                'Qty'                   => null
            ]);
            $dataItem['Status']     = Utility::$translator->trans("product.status.".$dataItem['Status']);
            $dataItem['Idx']            = ++$from;
            $data[] = $dataItem;
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new TransferSession();

        $filters = self::makeFilter($searchParams);
        
        $result = Utils::paginationResult($bizObject->getCollection(), $filters, $searchParams);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $dataItem                   = $bizObject->makeData($doc, [
                'ClientId'              => true,
                'TransferSessionCode'   => true,
                'C3PLName'              => true,
                'Status'                => true,
                'Content'               => true,
                "CreatedByName"         => true,
                "CreatedDate"           => true,
                "ReceivedDate"          => true
            ]);
            $dataItem['StatusText']     = Utility::$translator->trans("transfersession.status.".$dataItem['Status']);
            $dataItem['Idx']            = ++$from;
            $data[] = $dataItem;
        }
        return array(
            'Rows'  => $data,
            'Total' => $result['total']
        );
    }

    /**
     * Create Transfer Session
     */
    public static function save($data)
    {
        //DetailValidate::createValidateData($data);
        $bizObject = new TransferSession();
        $data['WarehouseId'] = \WFT\TransferSessionBundle\Lib\Utils::getWarehouseId();
        $bizObject->loadDocument($data);
        $result = $bizObject->save();
		//Save package
        foreach($data['Package']['Data'] as $item) {
            $item['Ref']    = $result;
            $item['Note']   = $data['Package']['Note']??"";
            $item['Status'] = $data['Package']['Status']??0;
            $item['TransferSessionCode'] = $data['TransferSessionCode']??"";
            $transferSessionPackage = new TransferSessionPackage();
            $transferSessionPackage->loadDocument($item);
            $transferSessionPackage->save();
        }
		//Save product
        foreach($data['Product']['Data'] as $item) {
            $item['Ref']    = $result;
            $item['Note']   = $data['Product']['Note']??"";
            $item['Status'] = $data['Product']['Status']??0;
            $item['TransferSessionCode'] = $data['TransferSessionCode']??"";
            $transferSessionProduct = new TransferSessionProduct();
            $transferSessionProduct->loadDocument($item);
            $transferSessionProduct->save();
        }
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['IsDeleted' => 0];
        if (isset($searchParams['filter'])) {
            $params = $searchParams['filter'];
            if (isset($params['ClientId'])) {
                $filters['ClientId'] =  $params['ClientId'];
            }
            if (isset($params['TransferSessionCode'])) {
                $filters['TransferSessionCode'] = ['$regex' => $params['TransferSessionCode'], '$options' => 'i'];
            }
            if (isset($params['Status'])) {
                $filters['Status'] =  $params['Status'];
            }
            if (isset($params['C3PLId'])) {
                $filters['C3PLId'] =  $params['C3PLId'];
            }
            if (isset($params['FromDate'])) {
                $filters['ReceivedDate']['$gte'] = strtotime($params['FromDate']);
            }
            if (isset($params['ToDate'])) {
                $filters['ReceivedDate']['$lte'] = strtotime($params['ToDate']);
            }
        }
        return $filters;
    }
}
