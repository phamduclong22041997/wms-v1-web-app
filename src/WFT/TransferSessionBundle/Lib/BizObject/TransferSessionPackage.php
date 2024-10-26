<?php

/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh, Huy Nghiem
 */

namespace WFT\TransferSessionBundle\Lib\BizObject;

use OVCore\UtilityBundle\Lib\BaseBizObject;

class TransferSessionPackage extends BaseBizObject
{
    protected $COLLECTION_NAME = "TransferSessionPackage";
    protected $COLLECTION_HISTORY_NAME = "TransferSessionPackageHistory";

    protected $schema = array(
        'Ref'                   => null,
        'ClientId'              => null,
        'ClientName'            => null,
        'EtonCode'              => null,
        'ExternalCode'          => null,
        'PackageNo'             => null,
        'TrackingCode'          => null,
        'Status'                => null,
        'Note'                  => null,
        'TransferSessionCode'   => null
    );
}