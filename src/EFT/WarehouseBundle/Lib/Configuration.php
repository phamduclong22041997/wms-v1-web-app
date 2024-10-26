<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\WarehouseBundle\Lib;

class Configuration {
    public static $CONNECTION = "default";

    //Warehouse
    const COLLECTION_WAREHOUSE                      = "Warehouse";
    const COLLECYION_WAREHOUSE_HIS                  = "WarehouseHis";
    const COLLECTION_WAREHOUSE_TYPE                 = "WarehouseType";
    const COLLECTION_WAREHOUSE_FUNCTION             = "WarehouseFunction";
    const COLLECTION_WAREHOUSE_POSITION             = "WarehousePosition";
}