<?php

class WP_CustomMenu_Helper_Data extends Mage_Core_Helper_Abstract
{
    public function isIE6()
    {
        if (!isset($_SERVER['HTTP_USER_AGENT'])) return;
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        preg_match('/MSIE ([0-9]{1,}[\.0-9]{0,})/', $userAgent, $matches);
        if (!isset($matches[1])) return;
        $version = floatval($matches[1]); #Mage::log($version);
        $flag = false; if( $version <= 6.0 ) $flag = true;
        return $flag;
    }
}
