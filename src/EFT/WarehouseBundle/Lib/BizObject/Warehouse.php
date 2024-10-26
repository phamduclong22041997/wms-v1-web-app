<?php
/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh
 */

namespace EFT\WarehouseBundle\Lib\BizObject;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\WarehouseBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;

class Warehouse {
    const COLLECTION_NAME = "Warehouse";

    private $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        'warehousecode'      => null,
        'warehousename'      => null,
        'warehousename_en'   => null
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
     * Make response data
     */
    public function makeComboData($document = null)
    {
        if($document != null) {
            $this->document = $document;
        }
        $schema = [
            'warehousecode'      => null,
            'warehousename'      => null,
            'warehousename_en'   => null
        ];
        $data = [];
        if($this->document != null) {
            foreach($schema as $key => $type) {
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
    public function getCollection() 
    {
        return MongoDBManager::getCollection(Warehouse::COLLECTION_NAME, Configuration::$CONNECTION);
    }
}