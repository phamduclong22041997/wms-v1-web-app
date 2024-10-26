<?php

namespace OVCore\SecurityBundle\Lib;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\SecurityBundle\Lib\SecurityManager;

class Config {
    const LIFE_TIMEOUT_AUTH = 7200;
    const LIFE_EXPIRE_AUTH = 7200;

    public static $token    = null;
    public static $appid    = null;
    public static $config   = null;
    public static $locale   = "vi";

    /**
     * Load system config
     */
    public static function loadConfig()
    {
        $collection = MongoDBManager::getCollection('SystemConfigs');
        $filters = array(
            'ckey'      => array('$in' => array('default')),
            'isdeleted' => 0
        );
        $cursor = $collection->find($filters, ['sort' => ['_id' => -1]]);
        self::$config = $cursor->getNext();
    }
}
