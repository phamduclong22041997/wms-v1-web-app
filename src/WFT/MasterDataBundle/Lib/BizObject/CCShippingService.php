<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh, Huy Nghiem
 */

namespace WFT\MasterDataBundle\Lib\BizObject;

use OVCore\UtilityBundle\Lib\BaseBizObject;

class CCShippingService extends BaseBizObject
{
    protected $COLLECTION_NAME = "CC.ShippingService";
    
    protected $schema = array(
        'Code'          => null,
        'Name'          => null,
        'Id'            => null
    );
}