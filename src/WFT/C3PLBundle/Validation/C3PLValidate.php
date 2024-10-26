<?php
/**
 * Copyright (c) 2020 OVTeam
 * Modified date: 2020/02/07
 * Modified by: Bang Doan
 */

namespace WFT\C3PLBundle\Validation;

use OVCore\MongoBundle\Lib\Utils;
use WFT\C3PLBundle\Lib\BizObject\C3PL;

class C3PLValidate {

    /**
    * Validate data for create
    */
    public static function createValidateData($data)
    {
        $packageList = [];
        foreach($data as $doc) {
            $packageList[] = $doc['PackageNo'];
        }
        $packageExists = [];
        $colection = (new C3PL()) -> getCollection();
        $cursor = $colection->find(
            ['IsDeleted' => 0, 'PackageNo' => ['$in' => $packageList]],
            [
                'projection' => ['PackageNo']
            ]
        );
        foreach($cursor as $doc) {
            $packageExists[] = $doc['PackageNo'];
        }

        if(count($packageExists) > 0) {
            $translator = \OVCore\UtilityBundle\Lib\Utility::$translator;
            
            $msg = sprintf($translator.trans("mess.package.exists"), implode(",", $packageExists));

            throw new \Exception($msg);
        }
    }

}