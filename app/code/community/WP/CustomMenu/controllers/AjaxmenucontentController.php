<?php

class WP_CustomMenu_AjaxmenucontentController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            Mage::helper('custommenu')->initCurrentCategory();
            $menu = Mage::helper('custommenu')->getMenuContent();
            $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($menu));
        }
    }
}
