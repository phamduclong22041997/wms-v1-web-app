<?php

return [
    Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true],
    Symfony\Bundle\WebServerBundle\WebServerBundle::class => ['dev' => true],
    OVCore\SecurityBundle\OVCoreSecurityBundle::class => ['all' => true],
    OVCore\ConfigurationBundle\OVCoreConfigurationBundle::class => ['all' => true],
    OVCore\QueueBundle\OVCoreQueueBundle::class => ['all' => true],
    EFT\NetworkingBundle\EFTNetworkingBundle::class => ['all' => true],
    EFT\WarehouseBundle\EFTWarehouseBundle::class => ['all' => true],
    WFT\C3PLBundle\WFTC3PLBundle::class => ['all' => true],
    WFT\MasterDataBundle\WFTMasterDataBundle::class => ['all' => true],
    // EFT\SmartcartBundle\EFTSmartcartBundle::class => ['all' => true],
];
