<?php

namespace OVCore\MongoBundle\Lib;

class MongoDBTransaction {
    public static $sessions = [];

    /**
     * Start transaction
     */
    public static function startTransaction($connection = 'default')
    {
        if ($sessions[$connection]) {
            $client = MongoDBManager::getClient($connection);
            self::$sessions[$connection] = $client->getManager()->startSession();
            $transactionOptions = [
                'readConcern' => new \MongoDB\Driver\ReadConcern(\MongoDB\Driver\ReadConcern::LOCAL),
                'writeConcern' => new \MongoDB\Driver\WriteConcern(\MongoDB\Driver\WriteConcern::MAJORITY, 1000),
                'readPreference' => new \MongoDB\Driver\ReadPreference(\MongoDB\Driver\ReadPreference::RP_PRIMARY),
            ];
            self::$sessions[$connection]->startTransaction($transactionOptions);
        }
    }

    /**
     * Rollback transaction
     */
    public static function rollbackTransaction($connection = 'default')
    {
        if ($sessions[$connection]) {
            self::$sessions[$connection]->abortTransaction();
            self::$sessions[$connection]->endSession();
        }
    }

    /**
     * Commit transaction
     */
    public static function commitTransaction($connection = 'default')
    {
        if ($sessions[$connection]) {
            self::$sessions[$connection]->commitTransaction();
            self::$sessions[$connection]->endSession();
        }
    }

    /**
     * Get transaction
     */
    public static function getTransaction($connection = 'default')
    {
        if ($sessions[$connection]) {
            return self::$sessions[$connection];
        }
    }
}