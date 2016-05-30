<?php

class WP_CustomMenu_Helper_Data extends Mage_Core_Helper_Abstract
{
    private $_menuData = null;

    public function isIE6()
    {
        if (!isset($_SERVER['HTTP_USER_AGENT'])) return;
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        preg_match('/MSIE ([0-9]{1,}[\.0-9]{0,})/', $userAgent, $matches);
        if (!isset($matches[1])) return;
        $version = floatval($matches[1]); #Mage::log($version);
        $flag = false; if ($version <= 6.0) $flag = true;
        return $flag;
    }

    public function getMenuData()
    {
        if (!is_null($this->_menuData)) return $this->_menuData;

        $blockClassName = Mage::getConfig()->getBlockClassName('custommenu/navigation');
        $block = new $blockClassName();

        $categories = $block->getStoreCategories();
        if (is_object($categories)) $categories = $block->getStoreCategories()->getNodes();

        if (Mage::getStoreConfig('custom_menu/general/ajax_load_content')) {
            $_moblieMenuAjaxUrl = str_replace('http:', '', Mage::getUrl('custommenu/ajaxmobilemenucontent'));
            $_menuAjaxUrl = str_replace('http:', '', Mage::getUrl('custommenu/ajaxmenucontent'));
        } else {
            $_moblieMenuAjaxUrl = '';
            $_menuAjaxUrl = '';
        }

        $this->_menuData = array(
            '_block'                        => $block,
            '_categories'                   => $categories,
            '_moblieMenuAjaxUrl'            => $_moblieMenuAjaxUrl,
            '_menuAjaxUrl'                  => $_menuAjaxUrl,
            '_showHomeLink'                 => Mage::getStoreConfig('custom_menu/general/show_home_link'),
            '_popupWidth'                   => Mage::getStoreConfig('custom_menu/popup/width') + 0,
            '_popupTopOffset'               => Mage::getStoreConfig('custom_menu/popup/top_offset') + 0,
            '_popupDelayBeforeDisplaying'   => Mage::getStoreConfig('custom_menu/popup/delay_displaying') + 0,
            '_popupDelayBeforeHiding'       => Mage::getStoreConfig('custom_menu/popup/delay_hiding') + 0,
            '_rtl'                          => Mage::getStoreConfig('custom_menu/general/rtl') + 0,
            '_mobileMenuEnabled'            => Mage::getStoreConfig('custom_menu/general/mobile_menu') + 0,
        );

        return $this->_menuData;
    }

    public function getMobileMenuContent()
    {
        $menuData = Mage::helper('custommenu')->getMenuData();
        extract($menuData);
        // --- Home Link ---
        $homeLinkUrl        = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_WEB);
        $homeLinkText       = $this->__('Home');
        $homeLink           = '';
        if ($_showHomeLink) {
            $homeLink = <<<HTML
<div id="menu-mobile-0" class="menu-mobile level0">
    <div class="parentMenu">
        <a href="$homeLinkUrl">
            <span>$homeLinkText</span>
        </a>
    </div>
</div>
HTML;
        }
        // --- Menu Content ---
        $mobileMenuContent = '';
        $mobileMenuContentArray = array();
        foreach ($_categories as $_category) {
            $mobileMenuContentArray[] = $_block->drawCustomMenuMobileItem($_category);
        }
        if (count($mobileMenuContentArray)) {
            $mobileMenuContent = implode("\n", $mobileMenuContentArray);
        }
        // --- Result ---
        $menu = <<<HTML
$homeLink
$mobileMenuContent
<div class="clearBoth"></div>
HTML;
        return $menu;
    }

    public function getMenuContent()
    {
        $menuData = Mage::helper('custommenu')->getMenuData();
        extract($menuData);
        // --- Home Link ---
        $homeLinkUrl        = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_WEB);
        $homeLinkText       = $this->__('Home');
        $homeLink           = '';
        if ($_showHomeLink) {
            $homeLink = <<<HTML
<div class="menu">
    <div class="parentMenu menu0">
        <a href="$homeLinkUrl">
            <span>$homeLinkText</span>
        </a>
    </div>
</div>
HTML;
    }
        // --- Menu Content ---
        $menuContent = '';
        $menuContentArray = array();
        foreach ($_categories as $_category) {
            $menuContentArray[] = $_block->drawCustomMenuItem($_category);
        }
        if (count($menuContentArray)) {
            $menuContent = implode("\n", $menuContentArray);
        }
        // --- Result ---
        $menu = <<<HTML
$homeLink
$menuContent
<div class="clearBoth"></div>
HTML;
        return $menu;
    }
}
