<?php

/*
 * Copyright (c) 2019 OVTeam
 * Modified Date: 2019/11/12
 * Modified By: Duy Huynh
 * */

namespace OVCore\SecurityBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use OVCore\SecurityBundle\Lib\SecurityManager;
class ControllerListener {

    /*
     * This function use for listening an event of caller controller
     */
    public function onKernelController(ControllerEvent $event) 
    {
        $request = $event->getRequest();
        $errMsg = "";
        $exAction = "denyAction";
        try {
            $token = $request->headers->get('token');
            $sc = $request->headers->get('scid');
            $route = $request->get('_route');
            $locale = $request->headers->get('locale', 'vi');

            if(!in_array($locale, ['vi'])) {
                $locale = 'vi';
            }

            \OVCore\SecurityBundle\Lib\Config::$token   = $token;
            \OVCore\SecurityBundle\Lib\Config::$locale   = $locale;
            
            //Load translate message
            $controller = $event->getController();
            if(is_array($controller) && method_exists($controller[0], 'loadTranslate')) {
                $controller[0]->loadTranslate();
            }
          
            SecurityManager::init();

            if (($passedAuth = SecurityManager::authen($route))) { 
                // $allowAccess = SecurityManager::allowAccess($route, $sc);
                // if($allowAccess === false) {
                //     $exAction = "exceptionAction";
                //     $errMsg = 'mess.auth.permission';
                // }
            } else {
                $errMsg = "mess.auth.deny";
            }
            
        } catch (\Exception $ex) {
            $errMsg = $ex->getMessage();
        }

        if($errMsg != "") {
            $this->throwError($event, $errMsg, $exAction);
        }
    }

    /**
     * Throw exception
     */
    private function throwError($event, $errMsg, $exAction)
    {
        $authCtrl = new \OVCore\SecurityBundle\Controller\AuthenticationController();
        $authCtrl->setExceptionMessage($errMsg);
        $authCtrl->loadTranslate();
        $newCtrl = array($authCtrl, $exAction);
        $event->setController($newCtrl);
    }
}
