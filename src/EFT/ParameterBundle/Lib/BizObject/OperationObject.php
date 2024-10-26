<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\ParameterBundle\Lib\BizObject;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\ClientBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;

class OperationObject {
    const COLLECTION_NAME = "ParameterOperationObject";

    private $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        'code'    => null,
        'name'    => null,
        'name_en' => null
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
                $this->ACTION = "DEL";
            }
            $this->document = $this->getCollection()->findOne(['code' => $ref, 'isdeleted' => 0]);
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
    public function makeDataCombo($document)
    {
        return [
            'code'    => $document->code,
            'name'    => $document->name,
            'name_en' => $document->name_en
        ];
    }

    /**
     * Make response data
     */
    public function makeDataRow($document)
    {
        return [
            'id'    => (string)$document->_id,
            'code'  => $document->code,
            'name'  => $document->name
        ];
    }

    /**
     * Make response data
     */
    public function makeData($document = null)
    {
        if($document != null) {
            $this->document = $document;
        }
        return [
            'id'      => (string)$this->document->_id,
            'code'    => $this->document->code,
            'name'    => $this->document->name,
            'name_en' => $this->document->name_en
        ];
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
        return MongoDBManager::getCollection(OperationObject::COLLECTION_NAME, Configuration::$CONNECTION);
    }
}