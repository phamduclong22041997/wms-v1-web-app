<?php
/**
 * Copyright (c) 2020 OVTeam
 * Modified date: 2020/02/07
 * Modified by: Bang Doan
 */

namespace EFT\ProductBundle\Lib\BizObject;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\ProductBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;

class Product {
    const COLLECTION_NAME   = "Product";
    const STATUS_INACTIVE   = "Inactive";
    const STATUS_ACTIVE     = "Active";

    private $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        'sku'                   => null,
        'productname'           => null,
        'productname_en'        => null,
        'description'           => null,
        'description_en'        => null,
        'clientsku'             => null,
        'manufacture'           => null,
        'industry'              => null,
        'color'                 => null,
        'size'                  => null,
        'effectivedate'         => null,
        'volume'                => null,
        'weight'                => null,
        'status'                => null,
        'producttype'           => null,
        'productnature'         => null,
        'storagetype'           => null,
        'expireddatemethod'     => null,
        'inventorymethod'       => null,
        'goodsmethod'           => null,
        'standardprice'         => null,
        'items'                 => null,
        'expireddate'           => null,
        'images'                => null

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
            $this->document = $this->getCollection()->findOne(['sku' => $ref, 'isdeleted' => 0]);
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
     * Get current action
     */
    public function getAction()
    {
        return $this->ACTION;
    }
    

    /**
     * Get collection
     */
    public function getCollection() 
    {
        return MongoDBManager::getCollection(Product::COLLECTION_NAME, Configuration::$CONNECTION);
    }
}