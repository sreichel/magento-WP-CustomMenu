<?php

if (!Mage::getStoreConfigFlag('custom_menu/general/enabled')) {
    class WP_CustomMenu_Block_Topmenu extends Mage_Page_Block_Html_Topmenu
    {
    }
} else {
    class WP_CustomMenu_Block_Topmenu extends WP_CustomMenu_Block_Navigation
    {
    }
}
