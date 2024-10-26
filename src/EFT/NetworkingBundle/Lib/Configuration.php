<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\NetworkingBundle\Lib;

class Configuration {
    public static $CONNECTION = "default";   
    
    const COLLECTION_FLOOR = "NetworkingFloor";
    const COLLECTION_ROOM = "NetworkingRoom";
    const COLLECTION_ROOM_TYPE = "NetworkingRoomType";
    const COLLECTION_SMARTCART = "NetworkingSmartcart";
    const COLLECTION_POINT = "NetworkingPoint";
    const COLLECTION_POINT_TYPE = "NetworkingPointType";
    const COLLECTION_TRANSPORT_DEVICE = "NetworkingTransportDevice";
    const COLLECTION_TRANSPORT_DEVICE_TYPE = "NetworkingTransportDeviceType";
    const COLLECTION_USING_STATUS = "NetworkingUsingStatus";
    const COLLECTION_TRANSPORT_DEVICE_ON_SMARTCART = "NetworkingTransportDeviceOnSmartcart";
    const COLLECTION_SMARTCART_CONFIGURATION = "SmartcartConfiguration";

    //Networking Address
    const COLLECTION_NETWORKING_ADDRESS_COUNTRY     = "AddressCountry";
    const COLLECTION_NETWORKING_ADDRESS_AREA        = "AddressArea";
    const COLLECTION_NETWORKING_ADDRESS_REGION      = "AddressRegion";
    const COLLECTION_NETWORKING_ADDRESS_PROVINCE    = "AddressProvince";
    const COLLECTION_NETWORKING_ADDRESS_CITY        = "AddressCity";
    const COLLECTION_NETWORKING_ADDRESS_DISTRICT    = "AddressDistrict";
    const COLLECTION_NETWORKING_ADDRESS_WARD        = "AddressWard";

    //Warehouse Property
    const WAREHOUSE_PROPERTY = "WarehouseProperty";
}