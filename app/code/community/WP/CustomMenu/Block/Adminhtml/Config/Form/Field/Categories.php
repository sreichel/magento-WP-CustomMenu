<?php
class WP_CustomMenu_Block_Adminhtml_Config_Form_Field_Categories extends Mage_Core_Block_Html_Select
{
    public function _toHtml()
    {
        $options = Mage::getSingleton('custommenu/system_config_source_categories')
            ->toOptionArray();
        foreach ($options as $option) {
            $this->addOption($option['value'], $option['label']);
        }
 
        return parent::_toHtml();
    }
 
    public function setInputName($value)
    {
        return $this->setName($value);
    }
}
