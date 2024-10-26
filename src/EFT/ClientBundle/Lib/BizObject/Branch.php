<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/17
 * Modified by: Pham Cuong
 */

namespace EFT\ClientBundle\Lib\BizObject;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\ClientBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;

class Branch {
    const COLLECTION_NAME = "ClientBranch";
    const COLLECTION_HISTORY_NAME = "ClientBranchHis";

    private $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        'client'     => null,
        'branchcode'    => null,
        'branchname'    => null,
        'branchname_en'  => null,
        'contactpoint' => null,
        'status' => null,
        'phone' => null,
        'fax' => null,
        'email' => null,
        'address' => [
            'address1' => null,
            'address2' =>null,
            'ward' => null,
            'district' => null,
            'city' => null,
            'province' => null,
            'country' => null,
            'zipcode' => ""      
            ]
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
        //     $hisCollection = $this->getCollection(self::COLLECTION_HISTORY_NAME);
        //     unset($tempDocument['_id']);
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
        $ref = $data['ref']??"";
        if($ref == "") {
            $this->document = new Document();
        } else {
            $this->ACTION = "UPDATE";
            if(isset($data['isdeleted']) && $data['isdeleted']) {
                $this->ACTION = "DEL";
            }
            $this->document = $this->getCollection()->findOne(['branchcode' => $ref, 'isdeleted' => 0]);
        }

        if($this->document == null) {
            throw new \Exception("Không tìm thấy dữ liệu.");
        }

        $this->grantData($data);

        return $this;
    }

    /**
     * Make response data
     */
    public function makeDataRow($document)
    {
        $data = [];
        if($document != null) {
            foreach($this->schema as $key => $type) {
                $data[$key] = $document[$key]??""; 
            }
        }
        return $data;
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
                $data[$key] = $this->document[$key]??""; 
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
    public function getCollection($collection = self::COLLECTION_NAME) 
    {
        return MongoDBManager::getCollection($collection, Configuration::$CONNECTION);
    }
}