<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/01/14
 * Modified by: Duy Huynh
 */

namespace EFT\PurchaseOrderBundle\Lib\BizObject;

use EFT\PurchaseOrderBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDB\Document;
use OVCore\MongoBundle\Lib\MongoDBManager;

class PurchaseOrderType {
    const COLLECTION_NAME = "POType";

    private $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        'code'             => null,
        'description'      => null,
        'description_en'   => null
    );

    /**
     * Save data
     */
    public function save()
    {
        throw new \Exception("mess.notpermitted");
    }

    /**
     * Get document
     */
    public function loadDocument($data) 
    {
        throw new \Exception("mess.notpermitted");
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
        throw new \Exception("mess.notpermitted");
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
    public function getCollection($collection = PurchaseOrderType::COLLECTION_NAME) 
    {
        return MongoDBManager::getCollection($collection, Configuration::$CONNECTION);
    }
}