<?php
namespace OVCore\UtilityBundle\Lib;

class ServerResponse
{
    private $_translate = null;
    /**
     * Operation is success or not
     * @access public
     * @var $Success
     */
    public $Success = true;

    /**
     * Array contains all replied data
     * @access public
     * @var $Data
     */
    public $Data = NULL;


    /**
     * Add an error info into ErrorInfo array & set Success to false
     * @param $errField : Field name
     * @param $errCode : Error code
     * @return none
     */
    public function addError($errors)
    {
        $this->Success = false;
        $this->Data = $errors;

        if($this->_translate != null && is_string($this->Data)) {
            $this->Data = $this->_translate->trans($this->Data);
        }
    }

    /**
     * Deny access
     */
    public function denyAccess($errors)
    {
        $this->Deny = true;
        $this->Success = false;
        $this->Data = $errors;
    }

    /**
     * Add an error info into ErrorInfo array & set Success to false
     * @param $errField : Field name
     * @param $errCode : Error code
     * @return none
     */
    public function setResponseData($data)
    {
        $this->Data = $data;
    }


    /**
     * Set translate
     */
    public function setTranslate($translate)
    {
        $this->_translate = $translate;
    }

}