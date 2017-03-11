<?php
class WP_CustomMenu_Block_Adminhtml_Config_Categories extends Mage_Adminhtml_Block_System_Config_Form_Field_Array_Abstract
{
    protected $_itemRenderer;

    public function _prepareToRender()
    {
        $this->addColumn('category', array(
            'label' => Mage::helper('custommenu')->__('Category'),
            'renderer' => $this->_getRenderer(),
        ));
        $this->addColumn('coulmn_count', array(
            'label' => Mage::helper('custommenu')->__('Column count'),
            'style' => 'width: 50px',
            'class' => 'required-entry validate-greater-than-zero',
        ));
 
        $this->_addAfter = false;
        $this->_addButtonLabel = Mage::helper('custommenu')->__('Add');
    }

    protected function _getRenderer()
    {
        if (!$this->_itemRenderer) {
            $this->_itemRenderer = $this->getLayout()->createBlock(
                'custommenu/adminhtml_config_form_field_categories',
                '',
                array('is_render_to_js_template' => true)
            );
        }
        return $this->_itemRenderer;
    }
 
    protected function _prepareArrayRow(Varien_Object $row)
    {
        $row->setData(
            'option_extra_attr_' . $this->_getRenderer()
                ->calcOptionHash($row->getData('category')),
            'selected="selected"'
        );
 
    }
}
