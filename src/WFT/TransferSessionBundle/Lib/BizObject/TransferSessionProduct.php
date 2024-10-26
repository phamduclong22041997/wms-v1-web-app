<?php

/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh, Huy Nghiem
 */

namespace WFT\TransferSessionBundle\Lib\BizObject;

use OVCore\UtilityBundle\Lib\BaseBizObject;

class TransferSessionProduct extends BaseBizObject
{
    protected $COLLECTION_NAME = "TransferSessionProduct";
    protected $COLLECTION_HISTORY_NAME = "TransferSessionProductHistory";

    protected $schema = array(
        'Ref'                   => null,
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
        'Qty'                   => null,
        'TransferSessionCode'   => null
    );
}