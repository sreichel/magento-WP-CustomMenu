<?php

if (!Mage::getStoreConfig('custom_menu/general/enabled') ||
   (Mage::getStoreConfig('custom_menu/general/ie6_ignore') && Mage::helper('custommenu')->isIE6()))
{
    class WP_CustomMenu_Block_Topmenu extends Mage_Page_Block_Html_Topmenu
    {

    }
    return;
}

class WP_CustomMenu_Block_Topmenu extends WP_CustomMenu_Block_Navigation
{

}
