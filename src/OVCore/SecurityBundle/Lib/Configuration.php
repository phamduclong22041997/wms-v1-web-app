<?php

namespace OVCore\SecurityBundle\Lib;

class Configuration {
    public static $CONNECTION = "default";
    
    const CONNECTION_AUTHEN = 'authen';
    const COLLECTION_AUTHEN_ROLE = 'userroles';

    const COLLECTION_ACCESS_CONTROL = "BaseAccessControl";
    const COLLECTION_PERMISSION = "BasePermission";
}