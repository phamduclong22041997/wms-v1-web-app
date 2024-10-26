<?php

namespace OVCore\MongoBundle\Lib\MongoDB;

use  OVCore\SecurityBundle\Lib\SecurityManager;

 class Document extends \MongoDB\Model\BSONDocument 
 {
    /**
     * Grand data
    */
    public function grantData($data)
    {
        foreach($data as $key => $val) {
            if($key === 'id')
                continue;
            $this->{$key} = $val;
        }
        $this->LastModified = new \MongoDB\BSON\UTCDateTime();
        if(!isset($data['IsDeleted'])) {
            $this->IsDeleted = 0;
        }

        if(!isset($this->_id)) {
            $this->CreatedDate = new \MongoDB\BSON\UTCDateTime();
        }
        $this->ModifiedBy   = SecurityManager::getClientInfo()->getModified();
    }
 }