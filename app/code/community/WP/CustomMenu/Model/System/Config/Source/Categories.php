<?php
class WP_CustomMenu_Model_System_Config_Source_Categories
{
    protected $options = array();
    
    /**
     * @return array
     */
    public function toOptionArray()
    {
        if (!$this->options) {
            $categories = Mage::getModel('catalog/category')->getCollection()
                ->addAttributeToSelect('name')
                ->addAttributeToFilter('level', 2)
                ->addAttributeToFilter('is_active', 1);

            foreach ($categories as $category) {
                $this->options[] = array(
                    'label' => $category->getName(),
                    'value' => $category->getId()
                );
            }
        }
        
        return $this->options;
    }
}
