<?php

namespace EFT\NetworkingBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\NetworkingBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class SmartcartConfigurationBiz
{
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
     * Format response data
     */
    private static function formatData($doc)
    {
        return array(
            "configurationcode" => $doc->configurationcode,
            "configuration" => $doc->configuration,
            "configdescription" => $doc->configdescription,
            "configdescription_en" => $doc->configdescription_en,
            "_length" => $doc->_length,
            "width" => $doc->width,
            "height" => $doc->height,
            "numoflevel" => $doc->numoflevel,
            "naminglevel" => $doc->naminglevel,
            "levelheight" => $doc->levelheight,
            "dimension" => $doc->_length . '*' . $doc->width . '*' . $doc->height,
            "smartcartdimension" => $doc->smartcartdimension
        );
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
            $persist = $collection->findOne(['configurationcode' => $ref, 'isdeleted' => 0]);
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
                    $configurationcode = self::generateCode('SCF-');
                    $persist['configurationcode'] = $configurationcode;
                    if($configurationcode){                        
                        $result = (string) $collection->insertOne($persist)
                            ->getInsertedId();
                    }
                }
            } else {
                if (isset($data['isdeleted']) && $data['isdeleted']) {
                    $smartcart = $collection->findOne(['configurationcode' => $ref, 'isdeleted' => 0, 'ismapping' => true]);
                    if ($smartcart) {
                        throw new \Exception('Mã cấu hình đã sử dụng trong hệ thống. Không thể xóa');
                    }
                    $persist->isdeleted = $data['isdeleted'];
                }

                $collection->updateOne(
                    ['configurationcode' => $ref, 'isdeleted' => 0],
                    ['$set' => $persist]
                );
                $result = (string) $persist['_id'];
            }
        }
        return $result;
    }

    /**
     * Generate Smartcart Code
     */
    private static function generateCode($prefix){
        $smartcartCollection = self::getCollection();
        $smCursor = $smartcartCollection->find(['isdeleted' => 0],['sort'=>['configurationcode' => -1], 'limit' => 1]);
        $lastSmartcart = $smCursor->toArray()[0];
        $lastNumber = intval(explode($prefix, $lastSmartcart['configurationcode'])[1]) + 1;
        $code = $prefix. str_pad((string)$lastNumber,6,"0", STR_PAD_LEFT);
        return $code;
    }

    /**
     * Validate
     */
    private static function validate($data)
    {
        $collection = self::getCollection();
        $count = $collection->count(['configurationcode' => $data['configurationcode'], 'isdeleted' => 0]);
        if ($count > 0) {
            throw new \Exception("Smartcart Code is existed in the system. Please enter again.");
        }
    }

    /**
     * Make request filters
     */
    private static function makeFilter($searchParams)
    {
        if (isset($searchParams['keyword']) && trim($searchParams['keyword'])) {
            $filters['configurationcode'] = ['$regex' => $searchParams['keyword'], '$options' => 'i'];
        }
        $filters['isdeleted'] = 0;
        return $filters;
    }

    /**
     * Get connection
     */
    private static function getCollection()
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_SMARTCART_CONFIGURATION, Configuration::$CONNECTION);
    }
}