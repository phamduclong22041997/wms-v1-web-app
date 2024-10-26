<?php

namespace OVCore\SecurityBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use OVCore\UtilityBundle\Lib\BaseController;
use OVCore\UtilityBundle\Lib\ServerResponse;


class AuthorizationController extends BaseController {

    protected function getBizClass()
    {
        return "\OVCore\SecurityBundle\Biz\AuthorizationBiz";
    }

    /**
     * Grant permission
     */
    public function grantPermissionAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            //Start transaction
            $cls = $this->getBizClass();
            $postData = $this->getRequestParams();
            $data = $cls::grantPermission($postData);
            $resp->setResponseData($data);

        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    public function loadScreenListAction()
    {
        header("Access-Control-Allow-Headers: *");
        $resp = new ServerResponse();
        try {
            $request = $this->get('request_stack')->getCurrentRequest();
            $cls = $this->getBizClass();
            $role = $request->query->get('role');
            
            $data = $cls::loadScreenList($role);

            $resp ->setResponseData($data);
        }catch(\Exception $e) {
            $resp->addError($e->getMessage());
        }
        return new Response(json_encode($resp));
    }

    public function getRoleListAction()
    {
        header("Access-Control-Allow-Headers: *");
        $resp = new ServerResponse();
        try {
            $cls = $this->getBizClass();

            $data = $cls::getRoleList();

            $resp ->setResponseData($data);
        }catch(\Exception $e) {
            $resp->addError($e->getMessage());
        }
        return new Response(json_encode($resp));
    }

    public function getListAction()
    {
        header("Access-Control-Allow-Headers: *");
        $resp = new ServerResponse();
        try {
            $searchParams = array();
            $cls = $this->getBizClass();

            $data = $cls::getList($searchParams);

            $resp ->setResponseData($data);
        }catch(\Exception $e) {
            $resp->addError($e->getMessage());
        }
        return new Response(json_encode($resp));
    }

    public function removeAction()
    {
        $resp = new ServerResponse();
        try {
            $ref = $this->getIdParam();
            $cls = $this->getBizClass();
            $method = $this->getRequestMethod();
            if($method === Request::METHOD_OPTIONS) {
                $data = true;
            } else {

                if(!$ref) {
                    throw new \Exception('mess.request.invalid');
                }
                $data = $cls::remove($ref);
            }

            $resp ->setResponseData($data);
        }catch(\Exception $e) {
            $resp->addError($e->getMessage());
        }
        return new Response(json_encode($resp));
    }

}