<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\SmartcartBundle\Lib\BizObject;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\SmartcartBundle\Lib\Configuration as Config;
use EFT\NetworkingBundle\Lib\Configuration as NetworkingConfig;
use OVCore\MongoBundle\Lib\MongoDBManager;

class Configuration {
    const COLLECTION_NAME = "SmartcartConfiguration";

    private $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        "configurationcode"                 => "",
        "configurationdescription"          => "",
        "configurationdescription_en"       => "",
        "size"                              => null,
        "numoflevel"                        => 0,
        "naminglevel"                       => 'A'
    );

    /**
     * Save data
     */
    public function save()
    {
        $collection = $this->getCollection();
        $result = null;
        if($this->ACTION == 'CREATE') {
            $result = (string)$collection->insertOne($this->document)->getInsertedId();
        } else {
            $collection->updateOne(
                ['_id' => $this->document['_id']],
                ['$set' => $this->document]
            );
            $result = (string)$this->document['_id'];
        }
        return $result;
    }

    /**
     * Get document
     */
    public function loadDocument($data) 
    {
        $ref = $data['ref']??"";
        if($ref == "") {
            $this->document = new Document();
        } else {
            $this->ACTION = "UPDATE";
            if(isset($data['isdeleted']) && $data['isdeleted']) {
                $country_collection = MongoDBManager::getCollection(NetworkingConfig::COLLECTION_SMARTCART, NetworkingConfig::$CONNECTION);
                $persist = $country_collection->findOne(['configinfo.configurationcode' => $ref, 'isdeleted' => 0]);
                if ($persist) {
                    throw new \Exception("mess.isusing");
                }
                $this->ACTION = "DEL";
            }
            $this->document = $this->getCollection()->findOne(['configurationcode' => $ref, 'isdeleted' => 0]);
        }

        if($this->document == null) {
            throw new \Exception("mess.notfound");
        }

        $this->grantData($data);

        return $this;
    }

    /**
     * Make response data
     */
    public function makeData($document = null)
    {
        if($document != null) {
            $this->document = $document;
        }

        $data = [];
        if($this->document != null) {
            foreach($this->schema as $key => $type) {                
                if($key == 'size'){
                    $tempArray = [
                        "length" => 0,
                        "width" => 0,
                        "height" => 0,
                        "levelheight" => 0
                    ];
                    foreach($tempArray as $_key => $value){
                        $tempArray[$_key] = round($this->document['size'][$_key], 2);
                    }

                    $data['size'] = $tempArray;
                } else {
                    $data[$key] = $this->document[$key]??"";
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
                $saveData[$key] = $data[$key];
            }
        }
        if($this->ACTION == "DEL") {
            $saveData['isdeleted'] = 1;
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
     * Get collection
     */
    public function getCollection() 
    {
        return MongoDBManager::getCollection(Configuration::COLLECTION_NAME, Config::$CONNECTION);
    }
}