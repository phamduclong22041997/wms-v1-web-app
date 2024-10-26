<?php

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\NetworkingBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class SmartcartBiz
{
    const COLLECTION_SMARTCART_PURPOSEUSING = "SmartcartPurposeUsing";
    const COLLECTION_SMARTCART_PRODUCTSIZE = "SmartcartProductSize";

    public static function getTransportDevices($searchParams)
    {
        $collection = MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART, Configuration::$CONNECTION);
        $cursor = $collection->find(['smartcartcode' => $searchParams['smartcartcode'], 'isdeleted' => 0]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        $index = 1;
        foreach ($cursor as $doc) {
            unset($doc->_id);
            $data['rows'][] = [
                'index' => $index,
                'bincode' => $doc->bincode,
                'transportdevicecode' => $doc->transportdevicecode ?? $doc->transportdevicecode,
                'level' => $doc->configuration['naminglevel']
            ];
            $index++;
            $data['total'] += 1;
        }
        return $data;
    }

    public function getConfigureInfo($searchParams)
    {
        $collection = self::getCollection();
        $obj = $collection->findOne(['configinfo.configurationcode' => $searchParams['configurationcode'], 'isdeleted' => 0]);
        if ($obj == null) {
            throw new \Exception('mess.smartcart.notfound');
        }
        return array(
            "smartcartcode"  => $obj->smartcartcode,
            "configuration" => $obj->configinfo['configurationcode']
        );
    }

    /**
     * Get One
     */
    public function getBinInfo($searchParams)
    {
        if (!isset($searchParams['bincode'])) {
            throw new \Exception('mess.smartcart.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['bininfo.binlist.bincode' => $searchParams['bincode'], 'isdeleted' => 0]);
        if ($obj == null) {
            throw new \Exception('mess.smartcart.notfound');
        }
        return array(
            "smartcartcode"  => $obj->smartcartcode,
            "configuration" => $obj->configinfo['configuration'],
            "purposeusing" => $obj->purposeusing['purposeusing'],
        );
    }

    public static function getProductsizeCombo()
    {
        $collection = MongoDBManager::getCollection(self::COLLECTION_SMARTCART_PRODUCTSIZE, Configuration::$CONNECTION);
        $cursor = $collection->find(['isdeleted' => 0]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach ($cursor as $doc) {
            $data['rows'][] = array(
                'productsize'      => $doc->productsize
            );
            $data['total'] += 1;
        }
        return $data;
    }

    public static function getPurposeCombo()
    {
        $collection = MongoDBManager::getCollection(self::COLLECTION_SMARTCART_PURPOSEUSING, Configuration::$CONNECTION);
        $cursor = $collection->find(['isdeleted' => 0]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach ($cursor as $doc) {
            $data['rows'][] = array(
                'purposeusing'      => $doc->purposeusing
            );
            $data['total'] += 1;
        }
        return $data;
    }
    public static function getConfigCombo()
    {
        $collection = MongoDBManager::getCollection(Configuration::COLLECTION_SMARTCART_CONFIGURATION, Configuration::$CONNECTION);
        $cursor = $collection->find(['isdeleted' => 0]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach ($cursor as $doc) {
            unset($doc->_id);
            unset($doc->lastmodified);
            unset($doc->isdeleted);
            unset($doc->createddate);
            unset($doc->modifiedby);
            $_tempSize = [];
            foreach($doc->size as $key => $value){
                $_tempSize[$key] = round($doc->size[$key],2,PHP_ROUND_HALF_UP);
            }
            $doc->size = $_tempSize;
            $data['rows'][] = $doc;
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
            $dataItem = self::formatData($doc);
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
        if (!isset($searchParams['smartcartcode'])) {
            throw new \Exception('mess.smartcart.notfound');
        }
        $collection = self::getCollection();
        $obj = $collection->findOne(['smartcartcode' => $searchParams['smartcartcode'], 'isdeleted' => 0]);
        if ($obj == null) {
            throw new \Exception('mess.smartcart.notfound');
        }
        return self::formatData($obj);
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
            $persist = $collection->findOne(['smartcartcode' => $ref, 'isdeleted' => 0]);
        }
        if ($persist != null) {
            $numofsmartcart = 1;
            if (isset($data['numofsmartcart']) && $data['numofsmartcart']) {
                $numofsmartcart = intval($data['numofsmartcart']);
            }
            $data['numofsmartcart'] = 1;
            $persist->grantData($data);
            if ($isNew) {
                for ($i = 0; $i < $numofsmartcart; $i++) {
                    $smartcartcode = self::generateCode('SMC-');
                    $persist['smartcartcode'] = $smartcartcode;
                    if ($smartcartcode) {
                        $persist['bininfo']['binlist'] = self::generateBinList($smartcartcode, $data);
                        $result = (string) $collection->insertOne($persist)
                            ->getInsertedId();
                    }
                }
            } else {
                if (!$data['status'] && self::checkMappingStatus($data['smartcartcode'])) {
                    throw new \Exception('Xe đẩy này đang được mapping với 1 đối tượng khác, không thể Inactive. Vui lòng kiểm tra lại');
                }

                if (isset($data['isdeleted']) && $data['isdeleted']) {
                    $smdvCollection = MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART, Configuration::$CONNECTION);
                    $count = $smdvCollection->count(['smartcartcode' => ['$regex' => $ref, '$options' => 'i'], 'isdeleted' => 0]);
                    if ($count) {
                        throw new \Exception('Mã smart cart đã sử dụng trong hệ thống. Không thể xóa');
                    }
                    $persist->isdeleted = $data['isdeleted'];
                }               

                $collection->updateOne(
                    ['smartcartcode' => $ref, 'isdeleted' => 0],
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
        $count = $collection->count(['smartcartcode' => ['$regex' => $data['smartcartcode'], '$options' => 'i'], 'isdeleted' => 0]);
        if ($count > 0) {
            throw new \Exception("Smartcart Code is existed in the system. Please enter again.");
        }
    }

    /**
     * Format response data
     */
    private static function formatData($doc)
    {
        return array(
            "smartcartcode"  => $doc->smartcartcode,
            "configinfo" => $doc->configinfo,
            "configuration" => $doc->configinfo['configuration'],
            "configdescription" => $doc->configinfo['configdescription'],
            "configdescription_en" => $doc->configinfo['configdescription_en'],
            "length" => $doc->configinfo['length'],
            "width" => $doc->configinfo['width'],
            "height" => $doc->configinfo['height'],
            "numoflevel" => $doc->configinfo['numoflevel'],
            "naminglevel" => $doc->configinfo['naminglevel'],
            "levelheight" => $doc->configinfo['levelheight'],
            "status" => $doc->status,
            "purposeusing" => $doc->purposeusing,
            "currentpoint" => $doc->currentpoint,
            "usagestatus" => $doc->usagestatus,
            "numofsmartcart" => $doc->numofsmartcart,
            "bininfo" => $doc->bininfo,
            "numofbin" => $doc->bininfo['numofbinperlevel'],
            "toteinfo" => $doc->toteinfo,
            "ismapping" => self::checkMappingStatus($doc->smartcartcode)
        );
    }

    /**
     * Get Smartcart Combo
     */
    public static function getCombo()
    {
        $collection = self::getCollection();
        $cursor = $collection->find(['isdeleted' => 0, 'status' => true], ['sort' => ['transportdevicecode' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );
        foreach ($cursor as $doc) {
            $data['rows'][] = array(
                "smartcartcode"  => $doc->smartcartcode
            );
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Generate Smartcart Code
     */
    private static function generateCode($prefix)
    {
        $smartcartCollection = self::getCollection();
        $smCursor = $smartcartCollection->find(['isdeleted' => 0], ['sort' => ['smartcartcode' => -1], 'limit' => 1]);
        $lastSmartcart = $smCursor->toArray()[0];
        $lastNumber = intval(explode($prefix, $lastSmartcart['smartcartcode'])[1]) + 1;
        $code = $prefix . str_pad((string) $lastNumber, 6, "0", STR_PAD_LEFT);
        return $code;
    }

    /**
     * Check if Smartcart is mapped with transport device
     */
    private static function checkMappingStatus($code){
        $smdvCollection = MongoDBManager::getCollection(Configuration::COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART, 
        Configuration::$CONNECTION);
        $count = $smdvCollection->count(['smartcartcode' => ['$regex' => $code, '$options' => 'i'], 'isdeleted' => 0]);
        return $count ? true : false;
    }

    /**
     * Generate Bin List
     */
    private static function generateBinList($smartcartcode, $data)
    {
        $tempArr = [];
        $_index = 1;
        $namingLevel = explode(',', $data['configinfo']['naminglevel']);
        $numOfBin = $data['bininfo']['numofbinperlevel'];
        $count = count($namingLevel);
        for ($i = 0; $i < $count; $i++) {
            for ($j = 0; $j < $numOfBin; $j++) {
                $_row = [
                    'index' => $_index,
                    'bincode' => $smartcartcode . "_" . $namingLevel[$i] . "_" . $_index,
                    'level' => $namingLevel[$i]
                ];
                $tempArr[] = $_row;
                $_index++;
            }
        }
        return $tempArr;
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        if (isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['smartcartcode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_SMARTCART, Configuration::$CONNECTION);
    }
}
