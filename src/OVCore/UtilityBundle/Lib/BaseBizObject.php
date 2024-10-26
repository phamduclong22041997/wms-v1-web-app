<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace OVCore\UtilityBundle\Lib;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\UtilityBundle\Lib\Utility;

class BaseBizObject {

    protected $COLLECTION_NAME = "";

    protected $COLLECTION_HISTORY_NAME = "";

    public static $CONNECTION = "default";

    protected $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        'IsDeleted'             => null,
        'CreatedBy'             => null,
        'CreatedDate'           => null,
        'ModifiedDate'          => null
    );

    /**
     * Save data
     */
    public function save()
    {
        $collection = $this->getCollection();
        $result = null;
        $tempDocument = $this->document;
        if($this->ACTION == 'CREATE') {
            $result = (string)$collection->insertOne($this->document)->getInsertedId();
        } else {
            $collection->updateOne(
                ['_id' => $this->document['_id']],
                ['$set' => $this->document]
            );
            $result = (string)$this->document['_id'];
        }

        // save history
        // if($result){
        //     $hisCollection = $this->getCollection($this->COLLECTION_HISTORY_NAME);
        //     if(isset($tempDocument['_id'])){
        //         unset($tempDocument['_id']);
        //     }           
        //     $tempDocument['refid'] = $result;
        //     $hisCollection->insertOne($tempDocument);
        // }
        
        return $result;
    }

    /**
     * Get document
     */
    public function loadDocument($data) 
    {
        $ref = $data['Id']??"";
        if($ref == "") {
            $this->document = new Document();
        } else {
            $this->ACTION = "UPDATE";
            if(isset($data['IsDeleted']) && $data['IsDeleted']) {
                $this->ACTION = "DEL";
            }
            $this->document = $this->getCollection()->findOne(['_id' => new \MongoDB\BSON\ObjectId($ref)]);
        }

        if($this->document == null) {
            throw new \Exception("resource.notfound");
        }

        $this->grantData($data);

        return $this;
    }

    /**
     * Make response data
     */
    public function makeData($document = null, $fields = [])
    {
        if($document != null) {
            $this->document = $document;
        }

        if(count($fields) == 0) {
            $fields = $this->schema;
        }

        $data = [];
        if($this->document != null) {
            foreach($fields as $key => $type) {
                $data[$key] = $this->document[$key]??""; 
                if($data[$key] instanceof \MongoDB\BSON\UTCDateTime) {
                    $data[$key] = Utility::convertDateTime($data[$key]);
                }
            }
        }
        return $data;
    }

    /**
     * Grant data
     */
    private function grantData($data)
    {        
        $saveData = [];
        foreach($this->schema as $key => $type) {
            if(isset($data[$key])) {
                if($type == 'datetime') {
                    $saveData[$key] = new \MongoDB\BSON\UTCDateTime($data[$key]??null);
                }else {
                    $saveData[$key] = $data[$key];                       
                }
            }
        }
     
        if($this->ACTION == "DEL") {
            $saveData['IsDeleted'] = 1;
        }
       
        $this->document->grantData($saveData);
    }

    /**
     * Check is new
     */
    public function isNew() 
    {
        return $this->ACTION == "CREATE";
    }

    /**
     * Check is Update
     */
    public function isUpdate() 
    {
        return $this->ACTION == "UPDATE";
    }

    /**
     * Check is Remove
     */
    public function isRemove()
    {
        return $this->ACTION == "DEL";
    }

    public function getDocument()
    {
        return $this->document;
    }

       /**
     * Get current action
     */
    public function getAction()
    {
        return $this->ACTION;
    }

    /**
     * Get collection
     */
    public function getCollection($COL_NAME = null) 
    {
        if(!$this->COLLECTION_NAME) {
            return null;
        }
        return MongoDBManager::getCollection($COL_NAME ?? $this->COLLECTION_NAME, self::$CONNECTION ?? "default");
    }
}