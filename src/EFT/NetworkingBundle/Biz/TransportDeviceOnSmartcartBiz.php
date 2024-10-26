<?php

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\NetworkingBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class TransportDeviceOnSmartcartBiz
{
    /**
     * Get list
     */
    public static function getTransportDeviceOnSmartcartCombo()
    {
        $collection = self::getCollection();
        $cursor = $collection->find(['isdeleted' => 0, 'status' => true], ['sort' => ['bincode' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach ($cursor as $doc) {
            $data['rows'][] = array(
                'bincode' => $doc->bincode,
                'description'         => $doc->description,
                'descriptioneng'      => $doc->descriptioneng,
                'transportdeviceonsmartcarttype'       => $doc->transportdeviceonsmartcarttype,
                'usingforsmartcart'   => $doc->usingforsmartcart,
                'status'              => $doc->status,
                'usingstatus'         => $doc->usingstatus,
                'numberoftransports'  => $doc->numberoftransports
            );
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get Transport Device Type
     */
    public static function getTransportDeviceOnSmartcartType()
    {
        $collection = MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_TYPE, Configuration::$CONNECTION);
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['type' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach ($cursor as $item) {
            $data['rows'][] = ['type' => $item->type];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get Transport Device Type
     */
    public static function getUsingStatus()
    {
        $collection = MongoDBManager::getCollection(Configuration::COLLECTION_USING_STATUS, Configuration::$CONNECTION);
        $cursor = $collection->find(['isdeleted' => 0]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach ($cursor as $item) {
            $data['rows'][] = ['name' => $item->name];
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult(self::getCollection(), $filters, $searchParams);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $dataItem = self::makeData($doc);
            $dataItem['index']  = ++$from;
            // $dataItem['actions'] = ['view', 'edit', 'delete'];
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
        if (!isset($searchParams['bincode'])) {
            throw new \Exception('mess.transportdeviceonsmartcart.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['bincode' => $searchParams['bincode'], 'isdeleted' => 0]);
        if ($obj == null) {
            throw new \Exception('mess.transportdeviceonsmartcart.notfound');
        }
        return self::makeData($obj);
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $ref = $data['ref'] ?? "";
        $isNew = true;
        $result = null;
        $collection = self::getCollection();

        if ($ref == "") {
            // self::validate($data);
            $persist = new Document();
        } else {
            $isNew = false;
            $persist = $collection->findOne(['bincode' => $ref, 'isdeleted' => 0]);
        }
        if ($persist != null) {
            $persist->grantData($data);
            if ($isNew) {
                $result = (string) $collection->insertOne($persist)
                    ->getInsertedId();
            } else {
                if (isset($data['isdeleted'])) {
                    $persist->isdeleted = $data['isdeleted'];
                }
                $collection->updateOne(
                    ['bincode' => $ref, 'isdeleted' => 0],
                    ['$set' => $persist]
                );
                $result = (string) $persist['_id'];
            }
        }
        return $result;
    }

    /**
     * Validate
     */
    private static function validate($data)
    {
        $collection = self::getCollection();
        $count = $collection->count(['bincode' => $data['bincode'], 'isdeleted' => 0]);
        if ($count > 0) {
            throw new \Exception("TransportCode Code is existed in the system. Please enter again.");
        }
    }

    /**
     * Make response data
     */
    private static function makeData($doc)
    {
        return array(
            'bincode'              => $doc->bincode,
            'smartcartcode'        => $doc->smartcartcode,
            'purposeusing'         => $doc->purposeusing,
            'transportdevicecode'  => $doc->transportdevicecode,
            'configuration'        => $doc->configuration
        );
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if (isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['bincode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART, Configuration::$CONNECTION);
    }
}
