<?php

namespace OVCore\SecurityBundle\Controller;

use OVCore\UtilityBundle\Lib\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;

use OVCore\UtilityBundle\Lib\ServerResponse;
use OVCore\SecurityBundle\Lib\Config;
use OVCore\SecurityBundle\Lib\SecurityManager;
 
class AuthenticationController extends BaseController {
    private $exceptionMsg = "";

    protected function getBizClass()
    {
        return "\OVCore\SecurityBundle\Biz\AuthenticationBiz";
    }

    /**
     * Setup channel session
     */
    public function setupSessionAction()
    {
        $response = new Response();
        header("Access-Control-Allow-Headers: *");
        $response->headers->set('Content-Type', "text/html");
        
        $request = $this->get('request_stack')->getCurrentRequest();
        $ref = $request->query->get("ref");
        $_redirect = "";
        if($ref) {
            $ref = base64_decode($ref);
            $token = json_decode($ref);
            $_redirect = $token->redirect;
            $jsonToken = $token->data;
            if (json_last_error() === JSON_ERROR_NONE) {
                $response->headers->setCookie(
                    new Cookie(
                        'APISID',
                        $jsonToken->APISID,
                        0,
                        '/'
                    )
                );
                $response->headers->setCookie(
                    new Cookie(
                        'SID',
                        $jsonToken->SID,
                        0,
                        '/',
                        null,
                        false,
                        false
                    )
                );
                $response->headers->setCookie(
                    new Cookie(
                        'APPNAME',
                        $jsonToken->NAME,
                        0,
                        '/'
                    )
                );
            }
        }
        // $image = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWBJREFUeNpi/P//PwMyKJ68eL+ytLgDA4ng/eevDO8+fVnQlxeXiE8dun1gAWRcNGnR/v9kgJ0nL/7vXLzhP1D/fEIOQMZMDFQEarKSDBqyEgmEHIEMqOoAIT4eBl1lOZIcQVUH8HBxMogJCZDkCKo6gIOdlUGAl5skR1DVASzMzAxcHGwkOYKJmJRKLGZiZGRgZWEhyREs1AyBMzfuMdx9+pLhH9Axf//9Y/j9+w/D95+/GP4zMDJwc7CDHAFSlkjQAf/JsNxGX4Ph2Zv3eNVsOnwmgTgH/CfdCRxsrAxKUmJ41XCys9E2EZKVcKkVAsSA/0Q7gFbexeIxuobA0IkCYBYe4BCgVSr4T2wI/P1HI/uJTIT/hm0iJDYK/tIsFf4fWAcQHQL//v0f2ET4h1ZRQHQa+Pt3YEPg798BTgN/aOYAYtMAraKA+BAYtmmASAfsOn2JJg54/+krhhhAgAEAOOceVk7I96wAAAAASUVORK5CYII=";
        if($_redirect) {
            $response->setContent('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Supra Fulfillment Technology</title><script>window.location.href="'. $_redirect.'";</script></head><body></body></html>');
        } else {
            $response->setContent('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Supra Fulfillment Technology</title></head><body></body></html>');
        }
        return $response;
    }

    /**
     * SSO session
     */
    public function ssoAction() 
    {
        $request = $this->get('request_stack')->getCurrentRequest();
        $resp = new ServerResponse();
        $response = new Response();
        try {
            $reqestParams = $this->getRequestParams();
            $cls = $this->getBizClass();
            $apisid = $request->cookies->get('APISID');
            $sid = $request->cookies->get('SID');
            $appName = $request->cookies->get('APPNAME');//$reqestParams['ref']??null;
            if(empty($apisid) || empty($sid)) {
                $data = array(
                    'valid' => false,
                    'token' => ""
                );
            } else {
                $data = $cls::generateSession($apisid, $sid, $appName);
            }
            $resp->setResponseData($data);
        } catch (\Exception $e) {
            $resp->setTranslate($this->_translator);
            $resp->addError($e->getMessage());
        }

        $response->setContent(json_encode($resp));
        return $response;
    }

    /**
     * Action that throwing an error message
     * @return json Object
     */
    public function exceptionAction()
    {
        $response = new Response();
        $response->headers->set('Content-Type', "application/json");

        $resp = new ServerResponse();
        $resp->setTranslate($this->_translator);
        $resp->addError($this->exceptionMsg);
        $response->setContent(json_encode($resp));
        $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        return $response;
    }

    /**
     * Action that throwing an error message
     * @return json Object
     */
    public function denyAction()
    {
        $response = new Response();
        $response->headers->set('Content-Type', "application/json");

        $resp = new ServerResponse();
        $resp->setTranslate($this->_translator);
        $resp->denyAccess($this->exceptionMsg);
        $response->setContent(json_encode($resp));
        $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        return $response;
    }

    /**
     * Set Exception message
     */
    public function setExceptionMessage($msg)
    {
        $this->exceptionMsg = $msg;
    }

    /**
     * Get translate path
     */
    protected function getTranslateSource($locale = "vi")
    {
        return realpath(__DIR__."/../Translations/security.$locale.php");
    }
}