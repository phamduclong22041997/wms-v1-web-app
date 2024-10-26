<?php

namespace  OVCore\QueueBundle\Lib;

use OVCore\SecurityBundle\Lib\SecurityManager;
use OVCore\QueueBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;

class ActionQueue
{
    const STATUS_WAITING    = "WAITING";
    const STATUS_PROCESSING = "PROCESSING";
    const STATUS_FINISH     = "FINSIH";
    const STATUS_FAIL       = "FAIL";
    const STATUS_CANCEL     = "CANCEL";

    /**
     * Description: Get Last Item of Queue
     */
    public static function pop()
    {
        $result = null;
        while (true) {
            $hightestPriorityType = ActionQueueManager::getHightestPriorityType();

            if ($hightestPriorityType === null) {
                break;
            }

            $result = self::getQueue()->findOneAndUpdate(
                array('content.requesttype' => $hightestPriorityType, 'status' => self::STATUS_WAITING, 'isdeleted' => 0),
                array('$set' => array('status' => self::STATUS_PROCESSING, 'isdeleted' => 1)),
                array('sort' => array('content.total' => 1))
            );

            ActionQueueManager::updateTotal($hightestPriorityType, -1);

            if ($result != null) {
                break;
            }
        }

        $content = null;

        if ($result != null) {
            $content = $result['content'];
            $content['id'] = $result['_id'];

            //Create History
            $content['status']  = self::STATUS_PROCESSING;
            $result['status']   = self::STATUS_PROCESSING;

            unset($result['_id']);
            self::createHistory($result);
        }

        return $content;
    }

    /**
     * Push to queue
     */
    public static function push($item)
    {
        $data = self::predictData($item);
        $result = self::createQueue($data);
        self::createHistory($result);
        return $result;
    }

    /**
     * Move to Success Status
     */
    public static function success($id)
    {
        $result = self::getQueue()
            ->findOneAndDelete(array('_id' => $id));

        if ($result) {
            if (isset($result['content']['actionid'])) {
                UserActionManager::fTotal(
                    $result['content']['actionid'],
                    1
                );
            }
            $result['status'] = self::STATUS_FINISH;
            unset($result['_id']);
            self::createHistory($result);
        }
    }

    /**
     * Move to Success Status
     */
    public static function error($id, $message)
    {
        $result = self::getQueue()
            ->findOneAndDelete(array('_id' => $id));

        if ($result) {
            if (isset($result['content']['actionid'])) {
                UserActionManager::eTotal(
                    $result['content']['actionid'],
                    1,
                    $message
                );
            }
            $result['status'] = self::STATUS_FAIL;
            $result['error'] = $message;
            unset($result['_id']);
            self::createHistory($result);
        }
    }

    /**
     * Description: Predict Data
     */
    protected static function predictData($item)
    {
        $clientInfo = SecurityManager::getClientInfo();
        $item['modifiedby'] = $clientInfo->getInfo();
        return $item;
    }

    /**
     * The number of item in queue
     */
    public static function count($type = null)
    {
        $criteria = array(
            'isdeleted' => 0,
            'status' => self::STATUS_WAITING
        );

        if ($type != null)
            $criteria['content.type'] = $type;

        return self::getQueue()->count($criteria);
    }

    /**
     * Create New Queue
     */
    private static function createQueue($item)
    {
        $data = array(
            'name'          => Configuration::$QUEUE_NAME,
            'content'       => $item,
            'connection'    => Configuration::$CONNECTION,
            'status'        => self::STATUS_WAITING,
            'lastmodified'  => new \DateTime(),
            'isdeleted'     => 0
        );
        self::getQueue()->insertOne($data);
        return $data;
    }

    /**
     * Description: Create History for each get item in the queue
     */
    private static function createHistory($content)
    {
        $content['isdeleted'] = 0;
        $content['lastmodified'] = new \DateTime();
        return self::getQueueHis()->insertOne($content);
    }


    /**
     * Description: Get Queue Collection
     */
    private static function getQueue()
    {
        return MongoDBManager::getCollection(
            Configuration::$COLLECTION_ACTIONQUEUE,
            Configuration::$CONNECTION
        );
    }

    /**
     * Description: Get QueueHis Collection
     */
    private static function getQueueHis()
    {
        return MongoDBManager::getCollection(
            Configuration::$COLLECTION_ACTIONQUEUE . 'History',
            Configuration::$CONNECTION
        );
    }
}
