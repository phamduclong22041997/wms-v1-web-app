<?php
namespace OVCore\SecurityBundle\Biz;

use OVCore\MongoBundle\Lib\MongoDBManager;
use OVCore\MongoBundle\Lib\MongoDB\Document;

class AuthorizationBiz
{
    const CONNECTION = 'default';
    const COLLECTION_NAME = "CFG.BaseAccessControl";
    const COLLECTION_PERMISSION = "CFG.BasePermission";

    const CONNECTION_AUTHEN = 'authen';
    const COLLECTION_ROLE = 'UserRoles';

    /**
     * Get menu list
     */
    public static function getMenuList($role)
    {
        $collection = MongoDBManager::getCollection(
            self::COLLECTION_PERMISSION,
            self::CONNECTION
        );
        $obj = $collection->findOne(['isdeleted' => 0, 'role' => $role]);
        if($obj) {
            return $obj['menu']??[];
        }
        return [];
    }

    /**
     * Grant Permission
     */
    public static function grantPermission($postData)
    {
        $collection = MongoDBManager::getCollection(
            self::COLLECTION_PERMISSION,
            self::CONNECTION
        );
        $count = $collection->count(['role' => $postData['role'], 'isdeleted' => 0]);
        $menu = self::buildMenu($postData['data'], $postData['role']);
        
        if($count == 0) {
            $persist = new Document();
            $postData['menu'] = $menu;
            $postData['isdeleted'] = 0;
            $persist->grantData($postData);
            $collection->insertOne($persist);
        } else {
            $collection->updateOne(['role' => $postData['role'], 'isdeleted' => 0], [
                '$set' => array(
                    'data' => $postData['data'],
                    'menu' => $menu
                )
            ]);
        }
        return [];
    }

    /**
     * Build screen
     */
    public static function loadScreenList($role)
    {
        $permissionData = array();
        if($role) {
            $collection = MongoDBManager::getCollection(
                self::COLLECTION_PERMISSION,
                self::CONNECTION
            );
            $obj = $collection->findOne(['role' => $role, 'isdeleted' => 0]);
            if($obj) {
                $_data = $obj['data'] ?? [];
                foreach($_data as $key=>$val) {
                    $permissionData[$key] = $val['selected'];

                    $_resource = $val['resources']??[];
                    foreach($_resource as $_key=>$_val) {
                        $permissionData[$_key] = $_val['selected'];
                    }
                }
            }
        }

        $collection = self::getCollection();
        $cursor = $collection->find(['ismenu' => true,'IsDeleted' => 0], ['sort' => ['level' => -1, 'position' => 1]]);

        $data = array();
        $lastKey = "";
        $map = array();
        foreach($cursor as $obj) {
            
            $_id = (string)$obj->_id;
            $pref = $obj->ref??"";
            $key = $_id;

            if(isset($map[$_id])) {
                foreach($map[$_id] as $_key) {
                    $newKey = $_id.$_key;

                    $data[$newKey] = $data[$_key];
                    unset($data[$_key]);
                    $data[$newKey]['title'] = $obj->title." >".$data[$newKey]['title'];
                    $data[$newKey]['plist'] = $_id.",".$data[$newKey]['plist'];

                    if($pref != "") {
                        if(!isset($map[$pref])) {
                            $map[$pref] = [];
                        }
                        $map[$pref][] = $newKey;
                    }
                }

            } else if(!isset($data[$key])) {
                if($pref != "") {
                    if(!isset($map[$pref])) {
                        $map[$pref] = [];
                    }
                    $map[$pref][] = $_id;
                }
                $data[$key] = array(
                    'id'        => $_id,
                    'name'      => $obj->name,
                    'title'     => $obj->title,
                    'plist'     => $_id,
                    'selected'  => $permissionData[$_id]??false,
                    'children'  => []
                );
            }
        }

        $tmp = array();
        foreach($data as $key => $item) {
            $tmp[$item['id']] = $item;
        }
        $data = $tmp;
        unset($tmp);

        $cursor = $collection->find(['ref' => ['$in' => array_keys($data)],'IsDeleted' => 0], ['sort' => ['level' => 1]]);

        foreach($cursor as $doc) {
            $key = (string)$doc->ref;
            $_id = (string)$doc->_id;
            $data[$key]['children'][] = array(
                'id'            => $_id,
                'name'          => $doc->name,
                'title'         => $doc->title,
                'selected'  => $permissionData[$_id]??false,
                'resourceid'    => $doc->resourceid
            );
        }
        return array(
            'rows'  => array_values($data),
            'total' => count($data)
        );
    }

    public static function getRoleList()
    {
        $collection =  MongoDBManager::getCollection(
            self::COLLECTION_ROLE,
            self::CONNECTION_AUTHEN
        );
        $cursor = $collection->find(['IsDeleted' => 0]);
        $result = array(
            'rows'  => array(),
            'total' => 0
        );
        foreach($cursor as $doc) {
            $result['rows'][] = array(
                'code'          => $doc->Code,
                'rolename'      => $doc->RoleName,
                'description'   => $doc->Description
            );
            $result['total'] += 1;
        }
        return $result;
    }

    public static function getList($searchParams = array())
    {
        $collection = self::getCollection();
        $cursor = $collection->find(['IsDeleted' => 0], ['sort' => ['level' => -1, 'position' => 1]]);

        $data = array();
        foreach($cursor as $obj) {
            $ref = $obj['ref']??"";
            $id = (string)$obj->_id;
            if($ref) {
                if(isset($data[$id])) {
                    $data[$id] = array_merge($data[$id], self::makeData($obj));
                }
                $nextPush = true;
                if(!isset($data[$ref])) {
                    $data[$ref] = self::makeData($obj);
                    $data[$ref]['children'] = array();
                    if(isset($data[$id])) {
                        $data[$ref]['children'][] = $data[$id];
                        unset($data[$id]);
                        $nextPush = false;
                    }
                }
                if($nextPush) { 
                    if(isset($data[$id])) {
                        $data[$ref]['children'][] = $data[$id];
                        unset($data[$id]);
                    } else {
                        $data[$ref]['children'][] = self::makeData($obj);
                    }
                   
                }
            
            } else {
                $ref = (string)$obj->_id;
                if(!isset($data[$ref])) {
                    $data[$ref] = self::makeData($obj);
                    $data[$ref]['children']  = array();
                } else {
                    $data[$ref] = array_merge($data[$ref], self::makeData($obj));
                }
            }
        }
        return array(
            'rows'  => $data,
            'total' => count($data)
        );
    }

    /**
     * Save
     */
    public static function save($data)
    {
        
        $id = $data['id']??"";
        $isNew = true;
        $result = null;
        $collection = self::getCollection();

        if($id == "") {
            $persist = new Document();
        } else {
            $isNew = false;
            $persist = $collection->findOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);
            // var_dump($persist);exit;
        }
        if($persist != null) {
            $persist->grantData($data);
            if($isNew) {
                $result = (string)$collection->insertOne($persist)
                                     ->getInsertedId();
            } else {
                $collection->updateOne(
                    ['_id' => new \MongoDB\BSON\ObjectId($id)],
                    ['$set' => $persist]
                );
                $result = (string)$persist['_id'];
            }
        }
        return $result;
    }

    public static function remove($ref)
    {
        $collection = self::getCollection();
        $itemList = [new \MongoDB\BSON\ObjectId($ref)];
        $refList = array($ref);
        while(count($refList)) {
            $cursor = $collection->find([
                'ref' => ['$in' => $refList]
            ]);
            $refList = array();
            foreach($cursor as $obj) {
                $itemList[] = $obj['_id'];
                $refList[] = (string)$obj['_id'];
            }
        }
        $collection->deleteMany(['_id' => array('$in' => $itemList)]);

        return true;
    }

    public static function buildMenu($postData, $role)
    {
        $dataPermission = [];
        foreach($postData as $key=>$val) {
            if($val['plist'] && $val['selected']) {
                $_plist = explode(",", $val['plist']);
                $dataPermission = array_merge($dataPermission, $_plist);
            }
        }

        $data = array();
        $screenList = self::getScreenList($dataPermission);
        foreach($screenList as $id => $val) {
            if(count($val['children']) == 0) {
                $screenList[$id]['type'] = 'link';
                unset($screenList[$id]['children']);
                unset($screenList[$id]['level']);
                $data[] = $screenList[$id];
            } else {
                $screenList[$id]['type'] = 'sub';
                $subData = [];

                foreach($val['children'] as $_key => $_val) {
                    if(count($_val['children']) == 0) {
                        $val['children'][$_key]['type'] = 'link';
                        // unset($val['children'][$_key]['children']);
                        unset($val['children'][$_key]['level']);
                        $subData[] = $val['children'][$_key];
                    } else {
                        $val['children'][$_key]['type'] = 'subchild';
                        $val['children'][$_key]['subchildren'] = $_val['children'];
                        
                        foreach($val['children'][$_key]['subchildren'] as $__key => $__val) {
                            $val['children'][$_key]['subchildren'][$__key]['type'] = 'link';
                            // unset($__val['children'][$__key]['children']);
                            unset($val['children'][$_key]['subchildren'][$__key]['level']);
                        }
                        unset($val['children'][$_key]['children']);
                        $subData[] =  $val['children'][$_key];
                        
                    }
                }

                $screenList[$id]['children'] =  $subData;
                

                $data[] = $screenList[$id];

            }
        }
        return $data;
    }

    public static function getScreenList($permissionData = array())
    {
        $collection = self::getCollection();
        $cursor = $collection->find(['IsDeleted' => 0], ['sort' => ['level' => -1, 'position' => 1]]);

        $data = array();
        foreach($cursor as $obj) {
            $ref = $obj['ref']??"";
            $id = (string)$obj->_id;
            $resourceid = $obj->resourceid??"";
            if($resourceid !== "") {
                continue;
            }
            if(!in_array($id, $permissionData)) {
                continue;
            }
            if($ref) {
                if(isset($data[$id])) {
                    $data[$id] = array_merge($data[$id], self::makeMenuData($obj));
                }
                $nextPush = true;
                if(!isset($data[$ref])) {
                    $data[$ref] = self::makeMenuData($obj);
                    $data[$ref]['children'] = array();
                    if(isset($data[$id])) {
                        $data[$ref]['children'][] = $data[$id];
                        unset($data[$id]);
                        $nextPush = false;
                    }
                }
                if($nextPush) { 
                    if(isset($data[$id])) {
                        $data[$ref]['children'][] = $data[$id];
                        unset($data[$id]);
                    } else {
                        $data[$ref]['children'][] = self::makeMenuData($obj);
                    }
                   
                }
            
            } else {
                $ref = (string)$obj->_id;
                if(!isset($data[$ref])) {
                    $data[$ref] = self::makeMenuData($obj);
                    $data[$ref]['children']  = array();
                } else {
                    $data[$ref] = array_merge($data[$ref], self::makeMenuData($obj));
                }
            }
        }
        return array_reverse($data);
    }

    /**
     * Make data array
     */
    private static function makeData($obj)
    {
        return array(
            'id'        => (string)$obj->_id,
            'ref'       => $obj->ref,
            'name'      => $obj->name,
            'title'     => $obj->title,
            'level'     => $obj->level,
            'ismenu'    => $obj->resourceid?false:true,
            'icon'      => $obj->icon,
            'path'      => $obj->path,
            'helplink'  => $obj->helplink,
            'resourceid'=> $obj->resourceid,
            'position'  => $obj->position,
            'isview'    => $obj->isview??false
        );
    }

    /**
     * Make data array
     */
    private static function makeMenuData($obj)
    {
        return array(
            'scid'          => (string)$obj->_id,
            'state'         => $obj->path,
            'name'          => $obj->title,
            'type'          => 'link',
            'icon'          => $obj->icon,
            'level'         => $obj->level,
            'isview'        => $obj->isview ?? false
        );
    }

    /**
     * Get collection
     */
    public static function getCollection()
    {
        return MongoDBManager::getCollection(
            self::COLLECTION_NAME,
            self::CONNECTION
        );
    }
}
