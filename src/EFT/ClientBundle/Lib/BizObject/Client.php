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

class Client {
    const COLLECTION_NAME = "Client";
    const COLLECTION_HISTORY_NAME = "ClientHis";

    private $ACTION = "CREATE";

    protected $document = null;

    protected $schema = array(
        'clientcode'            => null,
        'clientname'            => null,
        'clientname_en'         => null,
        'shortname'             => null,
        'clienttype'            => null,
        'status'                => null,
        'phone'                 => null,
        'fax'                   => null,
        'email'                 => null,
        'website'               => null,
        'contactpoint'          => ["name" => null, "phone" => null, "email" => null],      
        'banks'                 => [],
        'notes'                 => null,
        'address'               => [
                'address1'  => null,
                'address2'  =>null,
                'ward'      => null,
                'district'  => null,
                'city'      => null,
                'province'  => null,
                'country'   => null,
                'zipcode'   => ""      
        ],
        'billingaddress'        => [
                'address1'  => null,
                'address2'  =>null,
                'ward'      => null,
                'district'  => null,
                'city'      => null,
                'province'  => null,
                'country'   => null,
                'zipcode'   => ""   
            ],
        'logo'                  => null,
        'currencycode'          => null,
        'paymentterm'           => null
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

        // save history
        // if($result){
        //     $hisCollection = $this->getCollection(self::COLLECTION_HISTORY_NAME);
        //     // unset($collection['_id']);
        //     $collection['refid'] = $result;
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
            $this->document = $this->getCollection()->findOne(['clientcode' => $ref, 'isdeleted' => 0]);
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
    public function makeDataCombo($document)
    {
        $data = [];
        if($document != null) {
            $data['clientcode'] = $document['clientcode'];
            $data['clientname'] = $document['clientname'];
            $data['clienttype'] = $document['clienttype']?$document['clienttype']['clienttypecode']:"";
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
    public function getCollection($collection = Client::COLLECTION_NAME) 
    {
        return MongoDBManager::getCollection($collection, Configuration::$CONNECTION);
    }
}