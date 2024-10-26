<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh, Huy Nghiem
 */

namespace WFT\TransferSessionBundle\Lib\BizObject;

use OVCore\UtilityBundle\Lib\BaseBizObject;

class TransferSession extends BaseBizObject
{
    protected $COLLECTION_NAME = "TransferSession";
    protected $COLLECTION_HISTORY_NAME = "TransferSessionHistory";
    
    protected $schema = array(
        'TransferSessionCode'   => null,
        'WarehouseId'           => null,
        'ClientId'              => null,
        'C3PLId'                => null,
        'C3PLCode'              => null,
        'C3PLName'              => null,
        'Status'                => null,
        'ReceivedDate'          => 'datetime',
        'Content'               => null
    );
}