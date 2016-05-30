<?php

class WP_CustomMenu_Block_Toggle extends Mage_Core_Block_Template
{
    public function _prepareLayout()
    {
        if (!Mage::getStoreConfig('custom_menu/general/enabled')) return;
        if (Mage::getStoreConfig('custom_menu/general/ie6_ignore') && Mage::helper('custommenu')->isIE6()) return;
        $layout = $this->getLayout();
        $topnav = $layout->getBlock('catalog.topnav');
        if (is_object($topnav)) {
            $topnav->setTemplate('webandpeople/custommenu/top.phtml');
            $head = $layout->getBlock('head');
            $head->addItem('skin_js', 'js/webandpeople/custommenu/custommenu.js');
            $head->addItem('skin_css', 'css/webandpeople/custommenu/custommenu.css');
            // --- Insert menu content ---
            if (!Mage::getStoreConfig('custom_menu/general/ajax_load_content')) {
                $menuContent = $layout->getBlock('custommenu-content');
                if (!is_object($menuContent)) {
                    $menuContent = $layout->createBlock('core/template', 'custommenu-content')
                        ->setTemplate('webandpeople/custommenu/menucontent.phtml');
                }
                if (Mage::getStoreConfig('custom_menu/general/move_code_to_bottom')) {
                    $positionTargetName = 'before_body_end';
                } else {
                    $positionTargetName = 'content';
                }
                $positionTarget = $layout->getBlock($positionTargetName);
                if (is_object($positionTarget)) $positionTarget->append($menuContent);
            }
        }
    }
}
