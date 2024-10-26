<?php
namespace OVCore\SecurityBundle\BizObject;

class BaseAccessControlObject extends \OVCore\MongoBundle\Lib\MongoDB\Document 
{
    const COLLECTION_NAME = "BaseAccessControl";

    public $ref = null;
    public $name = "";
    public $level = 1;
    public $path = "";
    public $icon = "";
    public $helplink = "";
    public $title = "";
    public $resourceid = "";

    // /**
    //  * Grand data
    //  */
    public function grantData($data)
    {
        $this->ref          = $data['ref'];
        $this->name         = $data['name'];
        $this->level        = $data['level'];
        $this->path         = $data['path'];
        $this->icon         = $data['icon'];
        $this->helplink     = $data['helplink'];
        $this->title        = $data['title'];
        $this->resourceid   = $data['resourceid'];
    }

    /**
     * validate
     */
    public function validate($collection)
    {
        $total = $collection->count(
            [
                'name'  => $this->name,
                'level' => $this->level
            ]
        );
        if($total > 0) {
            throw new \Exception("mess.authorization.exists.");
        }
    }
}
