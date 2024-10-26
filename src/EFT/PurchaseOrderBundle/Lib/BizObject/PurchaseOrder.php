<?php
/**
 * Copyright (c) 2019-2020 OVTeam
 * Modified date: 2020/01/14
 * Modified by: Duy Huynh
 */

namespace EFT\PurchaseOrderBundle\Lib\BizObject;

use OVCore\MongoBundle\Lib\MongoDB\Document;
use EFT\PurchaseOrderBundle\Lib\Configuration;
use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\UtilityBundle\Lib\Utility;

class PurchaseOrder {
    const COLLECTION_NAME = "PO";
    const COLLECTION_HISTORY_NAME = "POHis";

    private $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        'pocode'                => null,
        'producttype'           => null,
        'potype'                => null,
        'postatus'              => null,
        'contact'               => null,
        'phonenumber'           => null,
        'originaldocumentcode'  => null,
        'refcode'               => null,
        'sourcewarehouse'       => null,
        'destinationwarehouse'  => null,
        'createddate'           => null,
        'shippingdate'          => null,
        'arrivaldate'           => null,
        'note'                  => null,
        'items'                 => null
    );

    /**
     * Save data
     */
    public function save()
    {
        $collection = $this->getCollection();
        $result = null;
        $tempDocument = $this->document;
        //unset($this->document['bankinfo']);
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
        if($result){
            $hisCollection = $this->getCollection(self::COLLECTION_HISTORY_NAME);
            if(isset($tempDocument['_id'])){
                unset($tempDocument['_id']);
            }           
            $tempDocument['refid'] = $result;
            $hisCollection->insertOne($tempDocument);
        }
        
        return $result;
    }

    /**
     * Get document
     */
    public function loadDocument($data) 
    {
        $ref = $data['pocode']??"";
        if($ref == "") {
            $this->document = new Document();
        } else {
            $this->ACTION = "UPDATE";
            if(isset($data['isdeleted']) && $data['isdeleted']) {
                $this->ACTION = "DEL";
            }
            $this->document = $this->getCollection()->findOne(['pocode' => $ref, 'isdeleted' => 0]);
        }

        if($this->document == null) {
            throw new \Exception("Không tìm thấy dữ liệu.");
        }

        if($this->ACTION == "CREATE") {
            $data['pocode'] = Utility::generateProcessCode('PO',"PO",'pocode',3);  
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
    public function getCollection($collection = PurchaseOrder::COLLECTION_NAME) 
    {
        return MongoDBManager::getCollection($collection, Configuration::$CONNECTION);
    }
}