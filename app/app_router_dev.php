<?php
/**
 * Description: Developer router of CCI Core2
 * Modified by: Duy Huynh
 * Modified date: 2017/01/10
 * ref: http://php.net/manual/en/features.commandline.webserver.php
 **/

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
 * This file implements rewrite rules for PHP built-in web server.
 *
 * See: http://www.php.net/manual/en/features.commandline.webserver.php
 *
 * If you have custom directory layout, then you have to write your own router
 * and pass it as a value to 'router' option of server:run command.
 *
 * @author: Michał Pipa <michal.pipa.xsolve@gmail.com>
 * @author: Albert Jessurum <ajessu@gmail.com>
 */

// Workaround https://bugs.php.net/64566
//parse_str($_POST, $data);

//Convert Post String to Array
/*if(isset($_SERVER["REQUEST_METHOD"]) && $_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_SERVER["CONTENT_TYPE"]) && $_SERVER["CONTENT_TYPE"] == "application/x-www-form-urlencoded;charset=UTF-8") {
        if(!empty($_POST)) {
            $_POST = json_decode((array_keys($_POST)[0]), true);
        }
    }
}*/

if (ini_get('auto_prepend_file') && !in_array(realpath(ini_get('auto_prepend_file')), get_included_files(), true)) {
    require ini_get('auto_prepend_file');
}

//Override /vanalytics/ path to ""
if(isset($_SERVER["SCRIPT_NAME"]) && preg_match("/vanalytics/", $_SERVER["SCRIPT_NAME"])) {
    $_SERVER["SCRIPT_NAME"] = str_replace("vanalytics/", "", $_SERVER["SCRIPT_NAME"]);
    $_SERVER["SCRIPT_FILE"] = $_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'];
    
    readfile($_SERVER["SCRIPT_FILE"]);
   exit;
}

//If is file, or root domain, return false
if (is_file($_SERVER['DOCUMENT_ROOT'].DIRECTORY_SEPARATOR.$_SERVER['SCRIPT_NAME']) &&
    (!isset($_SERVER["PATH_INFO"]) || $_SERVER['PATH_INFO'] == "/")) {
    return false;
}

//If Request is file, return false
if(isset($_SERVER["REQUEST_URI"]) && preg_match("/[.]/", $_SERVER["REQUEST_URI"])) {
    return false;
}

$_SERVER = array_merge($_SERVER, $_ENV);
$_SERVER['SCRIPT_FILENAME'] = $_SERVER['DOCUMENT_ROOT'].DIRECTORY_SEPARATOR.'app_dev.php';

// Since we are rewriting to app_dev.php, adjust SCRIPT_NAME and PHP_SELF accordingly
$_SERVER['SCRIPT_NAME'] = DIRECTORY_SEPARATOR.'app_dev.php';
$_SERVER['PHP_SELF'] = DIRECTORY_SEPARATOR.'app_dev.php';

//return true;
require 'app_dev.php';

error_log(sprintf('%s:%d [%d]: %s', $_SERVER['REMOTE_ADDR'], $_SERVER['REMOTE_PORT'], http_response_code(), $_SERVER['REQUEST_URI']), 4);
