<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/11/08
 * Modified by: Duy Huynh, Huy Nghiem
 */

namespace WFT\MasterDataBundle\Lib\BizObject;

use OVCore\UtilityBundle\Lib\BaseBizObject;

class WFTWarehouse extends BaseBizObject
{
    protected $COLLECTION_NAME = "WFT.Warehouse";
    
    protected $schema = array(
        'Id'            => null,
        'EtonCode'      => null,
        'Name'          => null,
        'FullName'      => null
    );
}