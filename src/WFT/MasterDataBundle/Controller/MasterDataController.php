<?php

/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2020/07/02
 * Modified by: Duy Huynh
 */

namespace WFT\MasterDataBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\BaseController;
use OVCore\UtilityBundle\Lib\ServerResponse;
use EFT\PurchaseOrderBundle\Lib\Configuration;

class MasterDataController extends BaseController
{
    protected function getBizClass()
    {
        return "\WFT\MasterDataBundle\Biz\MasterDataBiz";
    }

    public function getStorageEquipmentAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $cls = $this->getBizClass();
            $content =  $request->query->get('Content') ?? "";
            $data = $cls::getStorageEquipment($content);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function checkStorageEquipmentAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        $request = $this->get('request_stack')->getCurrentRequest();
        try {
            $cls = $this->getBizClass();
            // $content =  $request->query->get('Content') ?? "";
            $postData = $this->getRequestParams();
            $data = $cls::checkStorageEquipment($postData);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function updateStorageEquipmentAction() {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $postData = $this->getRequestParams();
            $data = $cls::updateStorageEquipment($postData);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
    
    public function getSOPollStatusAction()
    {

    }


    /**
     * Get Product Status
     */
    public function getProductStatusAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = array(
                'Rows'  => array(
                    array(
                        'Code' => 1,
                        'Status' => 'Mới'
                    ),
                    array(
                        'Code' => 2,
                        'Status' => 'Cũ'
                    ),
                    array(
                        'Code' => 3,
                        'Status' => 'Hàng hư hộp'
                    ),
                    array(
                        'Code' => 4,
                        'Status' => 'Hàng hư một phần'
                    ),
                    array(
                        'Code' => 5,
                        'Status' => 'Hàng hư toàn bộ'
                    ),
                    array(
                        'Code' => 6,
                        'Status' => 'Hàng hư trong kho'
                    ),
                    array(
                        'Code' => 7,
                        'Status' => 'Hàng hư bị mất trong kho'
                    ),
                    array(
                        'Code' => 8,
                        'Status' => 'Hàng hư hộp trong kho'
                    ),
                    array(
                        'Code' => 9,
                        'Status' => 'Hàng hư một phần trong kho'
                    ),
                    array(
                        'Code' => 10,
                        'Status' => 'Hàng hư toàn bộ trong kho'
                    ),
                    array(
                        'Code' => 11,
                        'Status' => 'Hàng hư hộp do vận chuyển'
                    ),
                    array(
                        'Code' => 12,
                        'Status' => 'Hàng hư một phần do vận chuyển'
                    ),
                    array(
                        'Code' => 13,
                        'Status' => 'Hàng hư hoàn toàn do vận chuyển'
                    ),
                    array(
                        'Code' => 14,
                        'Status' => 'Hàng hư bị mất do vận chuyển'
                    ),
                    array(
                        'Code' => 30,
                        'Status' => 'Hàng chờ xử lý'
                    ),
                ),
                'Total' => 5
            ); // $cls::getProductStatuss($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Product Status
     */
    public function getPackageStatusAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = array(
                'Rows'  => array(
                    array(
                        'Code' => 1,
                        'Status' => 'Sẳn sàng'
                    ),
                    array(
                        'Code' => 2,
                        'Status' => 'Sẳn sàng giao'
                    ),
                    array(
                        'Code' => 3,
                        'Status' => 'Đã bàn giao cho vận chuyển'
                    ),
                    array(
                        'Code' => 4,
                        'Status' => 'Đang luân chuyển trong nội bộ 3PL'
                    ),
                    array(
                        'Code' => 5,
                        'Status' => 'Đang chuyển giao'
                    ),
                    array(
                        'Code' => 6,
                        'Status' => 'Đã chuyển giao'
                    ),
                    array(
                        'Code' => 7,
                        'Status' => 'Đã trả'
                    ),
                    array(
                        'Code' => 8,
                        'Status' => 'Đã hủy'
                    ),
                    array(
                        'Code' => 9,
                        'Status' => 'Đang bị trả lại'
                    ),
                    array(
                        'Code' => 10,
                        'Status' => 'Hoãn'
                    ),
                    array(
                        'Code' => 11,
                        'Status' => 'Xác nhận trả hàng'
                    ),
                    array(
                        'Code' => 12,
                        'Status' => 'Đang kiểm hàng'
                    ),
                    array(
                        'Code' => 13,
                        'Status' => 'Đã kiểm hàng'
                    ),
                    array(
                        'Code' => 14,
                        'Status' => 'Khách hàng tự lấy'
                    ),
                    array(
                        'Code' => 15,
                        'Status' => 'Sẵn sàng lưu kho hàng hủy'
                    ),
                    array(
                        'Code' => 16,
                        'Status' => 'Đang lưu kho hàng hủy'
                    ),
                    array(
                        'Code' => 17,
                        'Status' => 'Đã lưu kho hàng hủy'
                    ),
                    array(
                        'Code' => 18,
                        'Status' => 'Giao hàng một phần'
                    ),
                    array(
                        'Code' => 19,
                        'Status' => 'Hàng trả đã về kho'
                    ),
                    array(
                        'Code' => 20,
                        'Status' => 'Đã trả một phần'
                    ),
                    array(
                        'Code' => 21,
                        'Status' => 'Chờ xử lý'
                    ),
                    array(
                        'Code' => 22,
                        'Status' => 'Mất'
                    )
                ),
                'Total' => 5
            ); // $cls::getProductStatuss($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
    
    /**
     * Get Transfer Session Status
     */
    public function getTransferSessionStatusAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = array(
                'Rows'  => array(
                    array(
                        'Code' => 1,
                        'Status' => 'Mới'
                    ),
                    array(
                        'Code' => 2,
                        'Status' => 'Hoàn thành'
                    )
                ),
                'Total' => 2
            ); // $cls::getProductStatuss($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get SO Pool Service Type
     */
    public function getSoPoolServiceTypeAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = array(
                'Rows'  => array(
                    array(
                        'Code' => 1,
                        'Name' => 'Mới'
                    ),
                    array(
                        'Code' => 30,
                        'Name' => 'Chờ xử lý'
                    )
                ),
                'Total' => 2
            ); // $cls::getProductStatuss($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get SO Pool Status
     */
    public function getSoPoolStatusAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = array(
                'Rows'  => array(
                    array(
                        'Code' => 1,
                        'Name' => 'Mới'
                    ),
                    array(
                        'Code' => 2,
                        'Name' => 'Đã tạo pick list'
                    ),
                    array(
                        'Code' => 3,
                        'Name' => 'Đã phân công lấy hàng'
                    ),
                    array(
                        'Code' => 4,
                        'Name' => 'Đã tạo Phương tiện lấy hàng'
                    ),
                    array(
                        'Code' => 5,
                        'Name' => 'Đã định vị Phương tiện chưa hàng'
                    ),
                    array(
                        'Code' => 6,
                        'Name' => 'Đang lấy hàng'
                    ),
                    array(
                        'Code' => 7,
                        'Name' => 'Hoàn thành'
                    )
                ),
                'Total' => 2
            ); // $cls::getProductStatuss($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
    
    /**
     * Get SO Pool Service Type
     */
    public function getSoPoolSoTypeAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = array(
                'Rows'  => array(
                    array(
                        'Code' => 1,
                        'Name' => 'B2C'
                    ),
                    array(
                        'Code' => 2,
                        'Name' => 'B2B'
                    )
                ),
                'Total' => 2
            ); // $cls::getProductStatuss($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Employee
     */
    public function getEmployeeAction()
    {
        $resp = new ServerResponse();
        $response = new Response();

        try {
            $cls = $this->getBizClass();
            $data = $cls::getEmployee();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Warehouse
     */
    public function getWarehouseAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $data = $cls::getWarehouse();
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get Province
     */
    public function getProvinceAction()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = array(
                'Rows'  => array(
                    array(
                        'Code' => 1,
                        'Name' => 'TP.HCM'
                    ),
                    array(
                        'Code' => 2,
                        'Name' => 'TP.Đà Nẵng'
                    ),
                    array(
                        'Code' => 3,
                        'Name' => 'TP.Nha Trang'
                    ),
                    array(
                        'Code' => 4,
                        'Name' => 'Tỉnh Tuyên Quang'
                    ),
                    array(
                        'Code' => 5,
                        'Name' => 'Tỉnh Sơn La'
                    )
                ),
                'Total' => 5
            ); // $cls::getProductStatuss($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__ . "/../Translations/MasterData.$locale.php");
    }
}