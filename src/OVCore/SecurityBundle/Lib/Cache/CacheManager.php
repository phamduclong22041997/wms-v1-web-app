<?php
namespace OVCore\SecurityBundle\Lib\Cache;
use OVCore\ConfigurationBundle\Lib\Configuration;
/**
 * Using redis
 */
class CacheManager
{
	const CACHE_APPNAME = "OVCache";
	private static $_cacher;

	/**
	 * Get Cacher
	 */
	protected static function getCacher()
	{
		if(null == self::$_cacher)
		{
			$redis_host =  Configuration::getConfig('cache_redis');
			if(!$redis_host) {
				$redis_host = "tcp://127.0.0.1:6379";
			}
			$client = new \Predis\Client($redis_host);
			self::$_cacher = new \Doctrine\Common\Cache\PredisCache($client);
			self::$_cacher->setNamespace(self::CACHE_APPNAME);
		}
		return self::$_cacher;
	}


	/**
	 * Save data to redis
	 */
	public static function saveData($name, $obj)
	{
		if (!self::getCacher()->save($name, $obj))
			throw new \Exception ("Could not set data to Redis '$name'.");
	}

	/**
	 * Get data from redis
	 */
	public static function loadData($name)
	{
		return self::getCacher()->fetch($name);
	}

	/**
	 * Remove data from redis
	 */
	public static function deleteCache($name) //delete a cahed object
	{
		if (!self::getCacher()->delete($name))
			throw new \Exception ("Could not delete Redis '$name' from Server.");
	}

	/**
	 * Remove all data from cache
	 */
	public static function removeAllCache()
	{
		self::getCacher()->deleteAll();
	}

	/**
	 * Flush all cache
	 */
	public static function flushCache()
	{
		if (!self::getCacher()->flushAll())
			throw new \Exception ("Could not flush redis.");
	}

	/**
	 * Modified date: 2017-07-07
	 * Modified by: Duy Huynh
	 *
	 **/
	public static function stats()
	{
		return self::getCacher()->getStats();
	}

}