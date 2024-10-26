<?php
namespace OVCore\SecurityBundle\Lib;

class ClientInfo {
    private $id;
    private $appid;
    private $displayName;
    private $clientTimeZone;
    private $loginname;
    private $employeeId;
	private $fullname;
    private $email;
    private $variantList = array();
    private $warehouse;
    private $warehouseId;
    private $crossToken;
    private $positionType;
    private $siteInfo = null;

    /**
     * Set session
     */
    public function setSession($data)
    {
        $currentToken           = \OVCore\SecurityBundle\Lib\Config::$token;
        $this->id               = $data['Id'];
        $this->loginname        = $data['LoginName']??"";
        $this->employeeId       = $data['EmployeeId']??null;
        $this->email            = $data['Email']??"";
        $this->fullname         = $data['FullName']??"";
        $this->clientTimeZone   = $data['Timezone']??"";
        $this->appid            = $data['AppID']??"";
        $this->crossToken       = $data['CrossToken']??"";
        $this->warehouse        = $data['Warehouse']??null;
        $this->warehouseId      = $data['WarehouseId']??null;
        $this->displayName      = $data['DisplayName']??"";
        $this->positionType      = $data['PositionType']??"";
        $this->variantList[$currentToken] = array(
            'Customer'          => $data['Customer']??"",
            'Facility'          => $data['Facility']??"",
            'Role'              => $data['Role']??"",
            'LastAccessTime'    => time()
        );
        $this->siteInfo         = $data['SiteInfo']??null;
    }

    /**
     * Remove token
     */
    public function removeToken($token)
    {
        if(isset($this->variantList[$token])) {
            unset($this->variantList[$token]);
        }
        return count($this->variantList);
    }

    public function checkToken($token)
    {
        return isset($this->variantList[$token])?true:false;
    }

    /**
     * Get id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get client timezone
     */
    public function getClientTimeZone()
    {
        return $this->clientTimeZone;
    }

    /**
     * Get access time
     */
    public function getAccessTime()
    {
        $currentToken = \OVCore\SecurityBundle\Lib\Config::$token;
        if(isset($this->variantList[$currentToken])) {
            return $this->variantList[$currentToken]['lastaccesstime'];
        }
        return 0;
    }

    /**
     * Grant access time
     */
    public function grantAccessTime()
    {
        $currentToken = \OVCore\SecurityBundle\Lib\Config::$token;
        if(isset($this->variantList[$currentToken])) {
            $this->variantList[$currentToken]['lastaccesstime'] = time();
        }
    }

    /**
     * Get login name
     */
    public function getLoginname()
    {
        return $this->loginname;
    }

    /**
     * Get full name
     */
    public function getFullname()
    {
        return $this->fullname;
    }

    /**
     * Get email
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Get user role
     */
    public function getRole()
    {
        $currentToken = \OVCore\SecurityBundle\Lib\Config::$token;
        $userRole = $this->variantList[$currentToken]['role'];
        return $userRole;
    }

    /**
     * Get customer
     */
    public function getCustomer()
    {
        $currentToken = \OVCore\SecurityBundle\Lib\Config::$token;
        $customer = $this->variantList[$currentToken]['customer'];
        return $customer;
    }

    /**
     * Get customer
     */
    public function getClient()
    {
        return "EFT";
    }

    /**
     * Get client info
     */
    public function toArray()
    {
        $currentToken = \OVCore\SecurityBundle\Lib\Config::$token;
        $data = $this->variantList[$currentToken];
        $data['LoginName']  = $this->loginname;
        $data['FullName']   = $this->fullname;
        $data['DisplayName'] = $this->displayName;
        $data['Email']      = $this->email;
        $data['Timezone']   = $this->clientTimeZone;
        $data['AppID']      = $this->appid;
        $data['Warehouse']  = $this->warehouse;
        $data['EmployeeId'] = $this->employeeId;
        $data['PositionType'] = $this->positionType;
        $data['SiteInfo']     = $this->siteInfo;
        return $data;
    }

    /**
     * Get info
     */
    public function getInfo()
    {
        return array(
            'Id'            => $this->id,
            'LoginName'     => $this->loginname,
            'FullName'      => $this->fullname,
            'Email'         => $this->email,
            'CrossToken'    => $this->crossToken,
            'Warehouse'     => $this->warehouse,
            'WarehouseId'   => $this->warehouseId,
            'EmployeeId'    => $this->employeeId,
            'PositionType'  => $this->positionType,
            'SiteInfo'      => $this->siteInfo
        );
    }

    public function getModified()
    {
        return $this->loginname;
    }
}
?>