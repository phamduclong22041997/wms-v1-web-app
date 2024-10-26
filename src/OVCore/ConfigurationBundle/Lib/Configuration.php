<?php

namespace OVCore\ConfigurationBundle\Lib;

class Configuration {

    /**
     * Get config
     */
    public static function getConfig($key)
    {
        $data = self::getContainer()->getParameter($key);
        return $data;
    }

    public static function getConnection($key)
    {
        $keys = explode(".", $key);
        $configData = self::getConnectionList();
        foreach ($keys as $key) {
            if (isset($configData[$key])) {
                $configData = $configData[$key];
            } else {
                $configData = array();
                break;
            }
        }
        return $configData;
    }

    /**
     * Get connection list
     */
    private static function getConnectionList() 
    {
        $data = self::getContainer()->getParameter('connections');
        if (empty($data)) {
            $data = array();
        }
        return $data;
    }

    /**
     * Get Container of Kernel
     */
    public static function getContainer()
    {
        $kernel = $GLOBALS['kernel'];
        if ('AppCache' == get_class($kernel)) {
            $kernel = $kernel -> getKernel();
        }
        return $kernel -> getContainer();
    }

}
