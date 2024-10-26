<?php

namespace OVCore\MongoBundle\Lib;

 use OVCore\MongoBundle\Lib\MongoDB\Client;

 class MongoDBManager {
    /**
     * Description: Get Mongo Client
     */
     public static function getClient($connection = "default", array $driverOptions = [])
     {
        $configs = self::getConfiguration($connection);
        $configs['server'] = 'mongodb://'.$configs['server'].':'.$configs['options']['port'];
        $client = (new Client($configs['server'], $configs['options'], $driverOptions))->{$configs['default_database']};
        $client->setConnectionName($connection);
        return $client;
     }

    /**
     * Description: Get Mongo Collection by MongoDBA
     */
    public static function getCollection($collection, $connection = "default", $driverOptions = [])
    {
      return self::getClient($connection, $driverOptions)->{$collection};
    }

    /**
     * Get connection
     */
    private static function getConfiguration($connection = "default")
    {
        return \OVCore\ConfigurationBundle\Lib\Configuration::getConnection($connection);
    }
 }