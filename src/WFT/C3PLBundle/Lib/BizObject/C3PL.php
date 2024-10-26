<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\C3PLBundle\Lib\BizObject;

use OVCore\UtilityBundle\Lib\BaseBizObject;

class C3PL extends BaseBizObject {
    protected $COLLECTION_NAME = "C3PL";
    protected $COLLECTION_HISTORY_NAME = "C3PLHistory";

    protected $schema = array(
        'Id'                => null,
        'Code'              => null,
        'Name'              => null,
        'IsActive'          => null,
        'ContactAddress'    => null,
        'ContactAddressId'  => null,
        'ContactName'       => null,
        'ContactPhone'      => null,
        'IsDeleted'         => null,
        'CreatedBy'         => null,
        'CreatedDate'       => null,
        'ModifiedBy'        => null,
        'ModifiedDate'      => null,
        'LogoUrl'           => null,
        'TrackingCodePrefix'=> null
    );
}