<?php

namespace OVCore\UtilityBundle\Lib;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use OVCore\UtilityBundle\Lib\ServerResponse;
use OVCore\MongoBundle\Lib\MongoDBTransaction;

use Symfony\Component\Translation\Loader\PhpFileLoader;
use Symfony\Component\Translation\Translator;

abstract class BaseController extends Controller {
    protected $_translator = null;

    /**
     * Get list
     */
    public function getListAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = $cls::getList($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get One
     */
    public function getOneAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $cls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $data = $cls::getOne($searchParams);
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Save Action
     */
    public function saveAction() 
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            //Start transaction
            MongoDBTransaction::startTransaction($this->getConnection());
            $cls = $this->getBizClass();
            $postData = $this->getRequestParams();
            $data = $cls::save($postData);
            $resp->setResponseData($data);

            MongoDBTransaction::commitTransaction($this->getConnection());

        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
            MongoDBTransaction::rollbackTransaction($this->getConnection());
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Export Excel
     */
    public function exportExcel()
    {
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $bizCls = $this->getBizClass();
            $searchParams = $this->getQueryParams();
            $bizCls::exportExcel($searchParams);
        } catch (\Exception $ex) {
            $resp->setTranslate($this->_translator);
            $resp->addError("System", array("key" => $ex->getMessage()));
            header("Set-Cookie: downloaded=" . $this->_translate->trans($ex->getMessage()) . "; path=/");
        }
        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Get request params
     */
    protected function getRequestParams() 
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        $jsonContent = $request->getContent();
        $decodedRequest = json_decode($jsonContent, true);
        return $decodedRequest['data'] ?? array();
    }

    /**
     * Get request params
     */
    protected function getQueryParams() 
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        $requestParams = array(
            'limit'     => $request->query->get('limit')??10,
            'page'      => $request->query->get('page')??0,
            'sort'      => $request->query->get('sort')??"",
            'keyword'   => $request->query->get('keyword') ?? "",
            'filter'    => $request->query->get('filter') ?? array(),
        );
        if($requestParams['sort']) {
            $requestParams['sort'] = json_decode($requestParams['sort'], true);
            foreach($requestParams['sort'] as $key=>$val) {
                if('desc' === strtolower($val)) {
                    $requestParams['sort'][$key] = -1;
                } else {
                    $requestParams['sort'][$key] = 1;
                }
            }
        }
        if($requestParams['filter']) {
            $requestParams['filter'] = json_decode($requestParams['filter'], true);
        }
        return $requestParams;
    }

    /**
     * Get id param
     */
    protected function getIdParam()
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        return $request->query->get('ref');
    }

    /**
     * Get request method
     */
    protected function getRequestMethod()
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        return $request->getMethod();
    }


    /**
     * Get connection name
     */
    protected function getConnection()
    {
        return 'default';
    }

    /**
     * Get translate path
     */
    public function loadTranslate()
    {
        $locale = \OVCore\SecurityBundle\Lib\Config::$locale;
        $translateSource = $this->getTranslateSource($locale);
        if($translateSource) {
            $translator = new Translator($locale);
            $translator->addLoader('php', new PhpFileLoader());
            $translator->addResource('php', $translateSource, $locale);
            $this->_translator = $translator;
            \OVCore\UtilityBundle\Lib\Utility::$translator = $translator;
        }
    }

    /**
     * Get translate source
     */
    protected function getTranslateSource($locale = "vi")
    {
        return "";
    }
}
