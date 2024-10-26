<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/02/07
 * Modified by: Duy Huynh
 */

namespace EFT\ClientBundle\Biz;

use OVCore\MongoBundle\Lib\Utils;
use EFT\ClientBundle\Lib\BizObject\CurrencyUnit;
use EFT\ClientBundle\Lib\BizObject\PaymentTerm;
use EFT\ClientBundle\Lib\BizObject\Client;

class UtilityBiz {

    /**
     * Get Currency Units
     */
    public static function getClientCombo()
    {
        $bizObject = new Client();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['clientcode' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeDataCombo($item);
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get Currency Units
     */
    public static function getCurrencyUnitCombo()
    {
        $bizObject = new CurrencyUnit();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['unit' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeData($item);
            $data['total'] += 1;
        }
        return $data;
    }

    /**
     * Get Currency Units
     */
    public static function getPaymentTermCombo()
    {
        $bizObject = new PaymentTerm();
        $collection = $bizObject->getCollection();

        $cursor = $collection->find(['isdeleted' => 0], ['sort' => ['type' => 1]]);
        $data = array(
            'rows'  => [],
            'total' => 0
        );

        foreach($cursor as $item) {
            $data['rows'][] = $bizObject->makeData($item);
            $data['total'] += 1;
        }
        return $data;
    }
}