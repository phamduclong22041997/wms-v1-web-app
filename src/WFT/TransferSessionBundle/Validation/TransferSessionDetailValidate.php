<?php

/**
 * Copyright (c) 2020 OVTeam
 * Modified date: 2020/07/06
 * Modified by: Huy Nghiem
 */

namespace WFT\TransferSessionBundle\Validation;

use WFT\TransferSessionBundle\Lib\BizObject\TransferSessionDetail;

class TransferSessionDetailValidate
{
    /**
     * Validate data for create
     */
    public static function createValidateData($data)
    {
        $packageList = [];
        $transferSessionCode = $data['TransferSessionCode'] ?? '';
        foreach ($data['PackageList'] as $doc) {
            $packageList[] = $doc['PackageNo'];
        }
        $colection = (new TransferSessionDetail())->getCollection();
        $cursor = $colection->find([
            'IsDeleted'           => 0, 
            'TransferSessionCode' => $transferSessionCode,
            'PackageList.PackageNo' => [
                '$in' => $packageList
            ]
        ]);
        $packageExists = [];
        foreach ($cursor as $doc) {
            foreach ($doc['PackageList'] as $packageList) {
                $packageExists[] = $packageList['PackageNo'];
            }
        }
        if (count($packageExists) > 0) {
            $translator = \OVCore\UtilityBundle\Lib\Utility::$translator;
            $msg = sprintf(
                $translator.trans("mess.package.exists"), implode(",", $packageExists)
                // "Danh sách kiện đã tồn tại ".implode(",", $packageExists)
            );
            throw new \Exception($msg);
        }
    }
}
