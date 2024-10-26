<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh, Huy Nghiem
 */

namespace WFT\TransferSessionBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use WFT\TransferSessionBundle\Lib\BizObject\TransferSessionDetail;
// use OVCore\UtilityBundle\Lib\Utility;

class TransferSessionDetailBiz
{
    /**
     * Create Transfer Session Detail
     */
    public static function save($data)
    {
        $bizObject = new TransferSessionDetail();
        $bizObject->loadDocument($data);
        return $bizObject->save();
    }

    /**
     * Get One
     */
    public static function getOne($searchParams)
    {
        $bizObject = new TransferSessionDetail();
        $filters = self::makeFilter($searchParams);
        $result = Utils::paginationResult($bizObject->getCollection(), $filters, $searchParams);
        $data = [];
        $from = $result['start'];
        foreach ($result['cursor'] as $doc) {
            $dataItem                   = $bizObject->makeData($doc, [
                'TransferSessionCode'   => true,
                'PackageList'           => true,
                'ProductList'           => true,
                "ModifiedBy"            => true,
                "Lastmodified"          => true,
                "CreatedDate"           => true
            ]);
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
        $filters = ['IsDeleted' => 0, 'TransferSessionCode' => ''];
        if (isset($searchParams['filter'])) {
            $params = $searchParams['filter'];
            if (isset($params['TransferSessionCode'])) {
                $filters['TransferSessionCode'] =  $params['TransferSessionCode'];
            }
        }
        return $filters;
    }
}
