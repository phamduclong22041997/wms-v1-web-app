<?php

namespace EFT\UtilityBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;

class UtilityController extends BaseController {
    protected function getBizClass()
    {
        return "\EFT\UtilityBundle\Lib\UploadUtility";
    }

    /**
     * Get Image
     */
    public function getImageAction()
    {
        try {
            $request = $this->get('request_stack')->getCurrentRequest();
            $apisid = $request->cookies->get('APISID');
            $sid = $request->cookies->get('SID');
            
            if(!$apisid && !$sid) {
                throw new \Exception("mess.auth.permission");
            }

            $cls = $this->getBizClass();

            $data = $cls::getImage($request->query->get("file", ""), $request->query->get("thumbnail", ""));
            $response = new Response();
            $response->headers->set('Content-type', "image/png");
            if(!$data) {
                $response->setContent("");
            }else {
                $date = new \DateTime();
                $date->modify('+7200 seconds');
                $response->setExpires($date);
                $response->headers->set('Content-Type', $data['mimetype']);
                $response->setContent($data['data']);
            }
            return $response;

        } catch (\Exception $ex) {
            return new Response("");
        }
    }
    /**
     * Get list
     */
    public function uploadAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $request = $this->get('request_stack')->getCurrentRequest();
            $file = $request->files->get('file');
            $ref = $request->request->get('ref');
            $cls = $this->getBizClass();

            $file->enableValidate = false;
            $file->enablePersist = false;
            $file->thumbnail = "";
            if($request->request->get('type') == 'persist') {
                $file->enablePersist = true;
            }
            if($request->request->get('type') == 'validate') {
                $file->enableValidate = true;
            }
            if($request->request->get('thumbnail')) {
                $file->thumbnail = $request->request->get('thumbnail');
            }
            $data = $cls::uploadFile($file, $ref);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get list
     */
    public function importAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $request = $this->get('request_stack')->getCurrentRequest();

            $file = $request->files->get('file');
            $columns = $request->request->get('cols');
            $cls = $this->getBizClass();

            $data = $cls::importFile($file, $columns);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }
}