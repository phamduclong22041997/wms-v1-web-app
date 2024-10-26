<?php

namespace EFT\SmartcartBundle\Biz;

use EFT\SmartcartBundle\Lib\BizObject\Configuration;
use OVCore\MongoBundle\Lib\Utils;

class ConfigurationBiz
{
    /**
     * Get list
     */
    public static function getList($searchParams)
    {
        $bizObject = new Configuration();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters, $searchParams);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $dataItem = $bizObject->makeData($doc);
            $dataItem['index']  = ++$from;
            $data[] = $dataItem;
        }
        return array(
            'rows'  => $data,
            'total' => $result['total']
        );
    }

    /**
     * Create/Update data
     */
    public static function save($data)
    {
        $bizObject = new Configuration();
        $bizObject->loadDocument($data);

        if($bizObject->isNew()) {
            self::validate($bizObject);
        }
        if($bizObject->isRemove()) {
            self::checkPeristData($bizObject->getDocument());
        }

        return $bizObject->save();
    }

    /**
     * Nếu kho đã sử dụng thi quăng ngoại lê - Mã kho đã sử dụng trong hệ thống. Không thể xóa
     */
    private static function checkPeristData($obj)
    {
        return true;
    }

    /**
     * Validate
     */
    private static function validate($bizObject)
    {
        $collection = $bizObject->getCollection();
        $document = $bizObject->getDocument();
        // $count = $collection->count(['configurationcode' => $document['configurationcode'], 'isdeleted' => 0]);
        $count = $collection->count([
            'configurationcode' => new \MongoDB\BSON\Regex("^".$document['configurationcode']."$", 'i'), 
            'isdeleted' => 0
        ]);
        if ($count > 0) {
            throw new \Exception("mess.existed");
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
}