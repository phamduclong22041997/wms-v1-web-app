<?php

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\NetworkingBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class TransportDeviceBiz
{
    const NOT_READY_STATUS = 'Không sẵn sàng';
    const READY_STATUS = 'Sẵn sàng';
    /**
     * Get list
     */
    public static function getTransportDeviceCombo()
    {
        $collection = self::getCollection();
        $cursor = $collection->find(['isdeleted' => 0, 'status' => true], ['sort' => ['transportdevicecode' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $doc) {
            $data['rows'][] = array(
                'transportdevicecode' => $doc->transportdevicecode,
                'description'         => $doc->description,
                'descriptioneng'      => $doc->descriptioneng,
                'transportdevicetype'       => $doc->transportdevicetype,
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
    public static function getTransportDeviceType()
    {
        $collection = MongoDBManager::getCollection(\EFT\SmartcartBundle\Lib\BizObject\TransportType::COLLECTION_NAME, Configuration::$CONNECTION);
        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['transporttypename' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach($cursor as $item) {
            $data['rows'][] = ['type' => $item->transporttypename];
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
        foreach($cursor as $item) {
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
        $searchParams['sort'] = ['transportdevicecode' => 1];
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
        if (!isset($searchParams['transportdevicecode'])) {
            throw new \Exception('mess.transportdevice.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['transportdevicecode' => $searchParams['transportdevicecode'], 'isdeleted' => 0]);
        if ($obj == null) {
            throw new \Exception('mess.transportdevice.notfound');
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
            self::validate($data);
            $persist = new Document();
        } else {
            $isNew = false;
            $persist = $collection->findOne(['transportdevicecode' => $ref, 'isdeleted' => 0]);
        }
        if ($persist != null) {
            $persist->grantData($data);
            if ($isNew) {
                $count = 1;
                $_code = $data['transportdevicecode'];
                for($i = 0; $i < $data['numberoftransports']; $i++){
                    $persist->transportdevicecode = (string) $_code . '_' . $count;
                    $persist->numberoftransports = 1;
                    $result = (string) $collection->insertOne($persist)
                    ->getInsertedId();
                    $count++;
                }
            } else {
                if (isset($data['isdeleted'])) {
                    $persist->isdeleted = $data['isdeleted'];
                    if(isset($data['isdeleted']) && $data['isdeleted']){
                        $deviceOnSmCollection = MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART, Configuration::$CONNECTION);
                        $count = $deviceOnSmCollection->count(['transportdevicecode' => ['$regex' => $data['ref'], '$options' => 'i'], 'isdeleted' => 0]);
                        if ($count > 0) {
                            throw new \Exception("Mã thiết bị vận chuyển đã được sử dụng trong hệ thống. Không thể xóa");
                        }
                    }
                } else {
                    $deviceOnSmCollection = MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART, Configuration::$CONNECTION);
                    $count = $deviceOnSmCollection->count(['transportdevicecode' => ['$regex' => $data['transportdevicecode'] ?? $data['ref'], '$options' => 'i'], 'isdeleted' => 0]);
                    if ($count > 0) {
                        throw new \Exception("Thiết bị vận chuyển đã sử dụng trong hệ thống. Không thể điều chỉnh. Vui lòng kiểm tra lại");
                    }
                }
                $collection->updateOne(
                    ['transportdevicecode' => $ref, 'isdeleted' => 0],
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
        $count = $collection->count(['transportdevicecode' => $data['transportdevicecode'], 'isdeleted' => 0]);
        if ($count > 0) {
            throw new \Exception("TransportCode Code is existed in the system. Please enter again.");
        }
        if(isset($data['isdeleted']) && $data['isdeleted']){
            $_collection = MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART, Configuration::$CONNECTION);
            $_count = $_collection->count(['transportdevicecode' => ['$regex' => $data['transportdevicecode'], '$options' => 'i'], 
            'isdeleted' => 0]);
            if ($count) {
                throw new \Exception("Thiết bị vận chuyển đã sử dụng trong hệ thống. Không thể xóa");
            }
        }    
    }

    /**
     * Make response data
     */
    private static function makeData($doc)
    {
        return array(
            'transportdevicecode' => $doc->transportdevicecode,
            'description'         => $doc->description,
            'descriptioneng'      => $doc->descriptioneng,
            'transportdevicetype'       => $doc->transportdevicetype,
            'usingforsmartcart'   => $doc->usingforsmartcart,
            'status'              => $doc->status,
            'usingstatus'         => self::generateUsingStatus($doc->transportdevicecode),
            'numberoftransports'  => $doc->numberoftransports
        );
    }

    /**
     * Generate Using Status
     */
    private static function generateUsingStatus($code){
        $collection = MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART, Configuration::$CONNECTION);
        $count = $collection->count(['transportdevicecode' => ['$regex' => $code, '$options' => 'i'], 'isdeleted' => 0]);
        if($count){
            return ['name' => self::NOT_READY_STATUS];
        }
        return ['name' => self::READY_STATUS];
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        $filters = ['isdeleted' => 0];
        if (isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['transportdevicecode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE, Configuration::$CONNECTION);
    }
}
