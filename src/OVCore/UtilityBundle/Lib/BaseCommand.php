<?php

namespace OVCore\UtilityBundle\Lib;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

use OVCore\SecurityBundle\Lib\SecurityManager;

abstract class BaseCommand extends ContainerAwareCommand {
    /**
     * Description: Login
     * */
    protected function login($info)
    {
        SecurityManager::consoleClientInfo($info);
    }

    /**
     * Description: Log Out
     * */
    protected function logout()
    {
    }

    /**
     * Description: Login By Account Name
     *
     * */
    private static function loginByAccount($id)
    {
    }
}
