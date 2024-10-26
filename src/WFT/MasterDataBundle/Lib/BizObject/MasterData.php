<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\MasterDataBundle\Lib\BizObject;

use OVCore\UtilityBundle\Lib\BaseBizObject;

class MasterData extends BaseBizObject {
    protected $COLLECTION_NAME = "StatusEnum";
    protected $COLLECTION_HISTORY_NAME = "StatusEnumHistory";

    protected $schema = array(
        "Id" => null,
        "TableName" => null,
        "ColumnName" => null,
        "Code" => null,
        "Description" => null,
        "Module" => null,
        "CreatedDate" => null,
        "CodePrefix" => null,
        "IsActive" => null
    );
}