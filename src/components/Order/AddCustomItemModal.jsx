import { useState, useCallback } from 'react';
import { X, Plus, Check, Trash2, FileText, Folder, DollarSign, List, FolderTree } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePOS } from '../../hooks/usePOS';
import { SETTINGS, CATEGORIES } from '../../data/menuData';

const AddCustomItemModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { addMenuItem, menu, setActiveCategory } = usePOS();

  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [isCreatingNewSubcategory, setIsCreatingNewSubcategory] = useState(false);
  const [isCreatingCustomDrink, setIsCreatingCustomDrink] = useState(false);
  
  const [pricingType, setPricingType] = useState('fixed');
  const [fixedPrice, setFixedPrice] = useState('');
  const [customSizes, setCustomSizes] = useState([
    { name: '500ml', price: '' },
    { name: '700ml', price: '' }
  ]);
  
  const [hasModifiers, setHasModifiers] = useState(false);
  const [modifierGroups, setModifierGroups] = useState(() => [{
    id: Date.now(),
    title: '',
    multiSelect: false,
    options: [{ id: Date.now(), name: '', price: '' }]
  }]);
  const [itemImage, setItemImage] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');

  // ✅ Get existing categories dynamically from menu (updates when menu changes)
  const existingCategories = Object.keys(menu).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  const isDrinksCategory = selectedCategory === 'drinks';
  const drinkSubcategories = CATEGORIES.drinks || [];

  const addSize = () => {
    setCustomSizes([...customSizes, { name: '', price: '' }]);
  };

  const removeSize = (index) => {
    setCustomSizes(customSizes.filter((_, i) => i !== index));
  };

  const updateSize = (index, field, value) => {
    const updated = [...customSizes];
    updated[index][field] = value;
    setCustomSizes(updated);
  };

  const addModifierGroup = () => {
    setModifierGroups([
      ...modifierGroups,
      {
        id: Date.now(),
        title: '',
        multiSelect: false,
        options: [{ id: Date.now(), name: '', price: '' }]
      }
    ]);
  };

  const removeModifierGroup = (groupIndex) => {
    setModifierGroups(modifierGroups.filter((_, i) => i !== groupIndex));
  };

  const updateModifierGroup = (groupIndex, field, value) => {
    const updated = [...modifierGroups];
    updated[groupIndex][field] = value;
    setModifierGroups(updated);
  };

  const addModifierOption = (groupIndex) => {
    const updated = [...modifierGroups];
    updated[groupIndex].options.push({ id: Date.now(), name: '', price: '' });
    setModifierGroups(updated);
  };

  const removeModifierOption = (groupIndex, optionIndex) => {
    const updated = [...modifierGroups];
    updated[groupIndex].options = updated[groupIndex].options.filter((_, i) => i !== optionIndex);
    setModifierGroups(updated);
  };

  const updateModifierOption = (groupIndex, optionIndex, field, value) => {
    const updated = [...modifierGroups];
    updated[groupIndex].options[optionIndex][field] = value;
    setModifierGroups(updated);
  };

  const resetForm = useCallback(() => {
    setItemName('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setNewCategoryName('');
    setNewSubcategoryName('');
    setIsCreatingNewCategory(false);
    setIsCreatingNewSubcategory(false);
    setIsCreatingCustomDrink(false);
    setPricingType('fixed');
    setFixedPrice('');
    setCustomSizes([
      { name: '500ml', price: '' },
      { name: '700ml', price: '' }
    ]);
    setHasModifiers(false);
    setModifierGroups([
      {
        id: Date.now(),
        title: '',
        multiSelect: false,
        options: [{ id: Date.now(), name: '', price: '' }]
      }
    ]);
    setItemImage('');
    setItemDescription('');
    setAddedItemName('');
  }, []);

  const handleAddItem = useCallback(() => {
    if (!itemName.trim()) {
      alert('Please enter an item name');
      return;
    }

    let finalCategory = selectedCategory;
    
    if (isCreatingNewCategory) {
      if (!newCategoryName.trim()) {
        alert('Please enter a category name');
        return;
      }
      finalCategory = newCategoryName.toLowerCase().replace(/\s+/g, '');
      
      if (isCreatingNewSubcategory && newSubcategoryName.trim()) {
        finalCategory = newSubcategoryName.toLowerCase().replace(/\s+/g, '');
      }
    } else if (isDrinksCategory) {
      if (isCreatingCustomDrink) {
        if (!newSubcategoryName.trim()) {
          alert('Please enter a custom drink type name');
          return;
        }
        finalCategory = newSubcategoryName.toLowerCase().replace(/\s+/g, '');
      } else {
        if (!selectedSubcategory) {
          alert('Please select a drink subcategory');
          return;
        }
        finalCategory = selectedSubcategory;
      }
    } else if (selectedCategory) {
      if (isCreatingNewSubcategory) {
        if (!newSubcategoryName.trim()) {
          alert('Please enter a subcategory name');
          return;
        }
        finalCategory = newSubcategoryName.toLowerCase().replace(/\s+/g, '');
      }
    } else if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    const newMenuItem = {
      id: `custom-${Date.now()}`,
      name: itemName.trim(),
      category: finalCategory,
      hasModifiers: hasModifiers,
      isCustom: true,
    };

    if (isCreatingNewSubcategory && newSubcategoryName.trim()) {
      newMenuItem.parentCategory = isCreatingNewCategory 
        ? newCategoryName.toLowerCase().replace(/\s+/g, '')
        : selectedCategory;
    } else if (isDrinksCategory && isCreatingCustomDrink) {
      newMenuItem.parentCategory = 'drinks';
    }

    if (pricingType === 'fixed') {
      const priceValue = parseFloat(fixedPrice) || 0;
      if (priceValue <= 0) {
        alert('Please enter a valid price');
        return;
      }
      newMenuItem.price = Math.round(priceValue * 100);
    } else if (pricingType === 'sizes') {
      const validSizes = customSizes.filter(s => s.name.trim() && parseFloat(s.price) > 0);
      if (validSizes.length === 0) {
        alert('Please add at least one size with a valid price');
        return;
      }
      
      const pricesObject = {};
      validSizes.forEach(size => {
        pricesObject[size.name.trim()] = Math.round(parseFloat(size.price) * 100);
      });
      newMenuItem.prices = pricesObject;
    }

    if (hasModifiers) {
      const validGroups = modifierGroups.filter(g => 
        g.title.trim() && 
        g.options.some(o => o.name.trim())
      );

      if (validGroups.length > 0) {
        newMenuItem.customModifiers = validGroups.map(group => ({
          groupId: `custom-${Date.now()}-${Math.random()}`,
          groupTitle: group.title.trim(),
          multiSelect: group.multiSelect,
          options: group.options
            .filter(o => o.name.trim())
            .map(option => ({
              id: `opt-${Date.now()}-${Math.random()}`,
              name: option.name.trim(),
              price: Math.round(parseFloat(option.price || 0) * 100)
            }))
        }));
      }
    }

    if (itemImage.trim()) {
      newMenuItem.image = itemImage.trim();
    }
    if (itemDescription.trim()) {
      newMenuItem.description = itemDescription.trim();
    }

    addMenuItem(newMenuItem);
    setActiveCategory(finalCategory);
    setAddedItemName(itemName.trim());

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
      onClose();
    }, 1500);
  }, [itemName, selectedCategory, selectedSubcategory, newCategoryName, newSubcategoryName,
      isCreatingNewCategory, isCreatingNewSubcategory, isCreatingCustomDrink, pricingType, 
      fixedPrice, customSizes, hasModifiers, modifierGroups, itemImage, itemDescription, 
      isDrinksCategory, addMenuItem, setActiveCategory, onClose, resetForm]);

  const handlePriceChange = (value) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFixedPrice(value);
    }
  };

  const handleCategoryChange = (value) => {
    if (value === 'new_category') {
      setIsCreatingNewCategory(true);
      setSelectedCategory('');
      setSelectedSubcategory('');
      setIsCreatingNewSubcategory(false);
      setIsCreatingCustomDrink(false);
    } else {
      setIsCreatingNewCategory(false);
      setSelectedCategory(value);
      setNewCategoryName('');
      setSelectedSubcategory('');
      setIsCreatingNewSubcategory(false);
      setIsCreatingCustomDrink(false);
      setNewSubcategoryName('');
    }
  };

  const handleDrinkSubcategoryChange = (value) => {
    if (value === 'custom_drink') {
      setIsCreatingCustomDrink(true);
      setSelectedSubcategory('');
    } else {
      setIsCreatingCustomDrink(false);
      setSelectedSubcategory(value);
      setNewSubcategoryName('');
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    },
    modal: {
      background: theme.cardBg,
      borderRadius: '16px',
      width: '650px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      boxShadow: theme.shadowLarge,
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      padding: '20px 24px',
      borderBottom: `2px solid ${theme.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: theme.textPrimary,
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: theme.textSecondary,
      padding: '4px',
    },
    body: {
      padding: '24px',
      overflowY: 'auto',
      flex: 1,
      scrollbarWidth: 'thin',
    },
    section: {
      marginBottom: '24px',
      padding: '16px',
      background: theme.bgSecondary,
      borderRadius: '10px',
      border: `1px solid ${theme.border}`,
    },
    sectionTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    subsection: {
      marginTop: '12px',
      padding: '12px',
      background: theme.cardBg,
      borderRadius: '8px',
      border: `2px dashed ${theme.primary}`,
    },
    subsectionTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: theme.primary,
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      background: theme.inputBg,
      color: theme.textPrimary,
      fontSize: '14px',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      background: theme.inputBg,
      color: theme.textPrimary,
      fontSize: '14px',
      outline: 'none',
      minHeight: '60px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    select: {
      width: '100%',
      padding: '10px',
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      background: theme.inputBg,
      color: theme.textPrimary,
      fontSize: '14px',
      outline: 'none',
      cursor: 'pointer',
    },
    radioGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    radioOption: (isSelected) => ({
      flex: '1 1 120px',
      padding: '10px',
      border: `2px solid ${isSelected ? theme.primary : theme.border}`,
      borderRadius: '8px',
      background: isSelected ? `${theme.primary}15` : theme.cardBg,
      cursor: 'pointer',
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: '600',
      color: isSelected ? theme.primary : theme.textSecondary,
      transition: 'all 0.2s ease',
    }),
    sizeRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr auto',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '10px',
    },
    removeBtn: {
      width: '36px',
      height: '36px',
      padding: '0',
      border: 'none',
      borderRadius: '8px',
      background: theme.danger,
      color: '#FFFFFF',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addBtn: {
      width: '100%',
      padding: '10px',
      border: `2px dashed ${theme.primary}`,
      borderRadius: '8px',
      background: 'transparent',
      color: theme.primary,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px',
      background: theme.cardBg,
      borderRadius: '8px',
      cursor: 'pointer',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
    },
    checkboxLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: theme.textPrimary,
      cursor: 'pointer',
    },
    modifierGroup: {
      padding: '12px',
      background: theme.cardBg,
      borderRadius: '8px',
      marginBottom: '12px',
      border: `1px solid ${theme.border}`,
    },
    modifierGroupHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    modifierOptionRow: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr auto',
      gap: '8px',
      alignItems: 'center',
      marginBottom: '8px',
    },
    smallInput: {
      padding: '8px',
      fontSize: '13px',
    },
    footer: {
      padding: '20px 24px',
      borderTop: `2px solid ${theme.border}`,
      display: 'flex',
      gap: '12px',
      flexShrink: 0,
    },
    button: (variant) => ({
      flex: 1,
      padding: '14px',
      border: 'none',
      borderRadius: '10px',
      background: variant === 'primary' ? theme.success : theme.bgSecondary,
      color: variant === 'primary' ? '#FFFFFF' : theme.textSecondary,
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }),
    successScreen: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 40px',
    },
    successIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: theme.success,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    successText: {
      fontSize: '20px',
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: '8px',
    },
  };

  if (showSuccess) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal} className="add-item-modal">
          <div style={styles.successScreen}>
            <div style={styles.successIcon}>
              <Check size={40} color="#FFFFFF" />
            </div>
            <div style={styles.successText}>"{addedItemName}" Added!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose} className="add-item-overlay">
      <style>{`
        /* 📱 Tablet (768px - 1024px) */
        @media (max-width: 1024px) and (min-width: 768px) {
          .add-item-modal {
            width: 600px !important;
          }
          .add-item-header {
            padding: 18px 20px !important;
          }
          .add-item-title {
            font-size: 18px !important;
          }
          .add-item-body {
            padding: 20px !important;
          }
          .add-item-footer {
            padding: 18px 20px !important;
          }
        }

        /* 📱 Mobile (480px - 768px) */
        @media (max-width: 768px) {
          .add-item-modal {
            width: 100% !important;
            max-height: 95vh !important;
            border-radius: 16px 16px 0 0 !important;
            margin-top: auto !important;
          }
          .add-item-overlay {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .add-item-header {
            padding: 16px !important;
          }
          .add-item-title {
            font-size: 17px !important;
          }
          .add-item-body {
            padding: 16px !important;
          }
          .add-item-section {
            margin-bottom: 20px !important;
            padding: 14px !important;
          }
          .add-item-section-title {
            font-size: 14px !important;
            margin-bottom: 10px !important;
          }
          .add-item-footer {
            padding: 16px !important;
          }
          .add-item-btn {
            padding: 13px !important;
            font-size: 14px !important;
          }
          .add-item-size-row {
            grid-template-columns: 1fr 1fr auto !important;
            gap: 8px !important;
          }
          .add-item-modifier-option-row {
            grid-template-columns: 1fr 80px auto !important;
            gap: 6px !important;
          }
        }

        /* 📱 Small Mobile (< 480px) */
        @media (max-width: 480px) {
          .add-item-header {
            padding: 14px 12px !important;
          }
          .add-item-title {
            font-size: 16px !important;
          }
          .add-item-body {
            padding: 12px !important;
          }
          .add-item-section {
            margin-bottom: 16px !important;
            padding: 12px !important;
          }
          .add-item-section-title {
            font-size: 13px !important;
          }
          .add-item-footer {
            padding: 14px 12px !important;
            gap: 10px !important;
          }
          .add-item-btn {
            padding: 12px !important;
            font-size: 13px !important;
          }
          .add-item-radio-group {
            gap: 8px !important;
          }
          .add-item-radio-option {
            flex: 1 1 100px !important;
            padding: 8px !important;
            font-size: 12px !important;
          }
          .add-item-size-row {
            grid-template-columns: 1fr 70px auto !important;
            gap: 6px !important;
          }
          .add-item-remove-btn {
            width: 32px !important;
            height: 32px !important;
          }
        }
      `}</style>

      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="add-item-modal">
        <div style={styles.header} className="add-item-header">
          <div style={styles.title} className="add-item-title">Add New Menu Item</div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.body} className="add-item-body">
          {/* Basic Information */}
          <div style={styles.section} className="add-item-section">
            <div style={styles.sectionTitle} className="add-item-section-title">
              <FileText size={18} />
              Basic Information
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Item Name *</label>
              <input
                type="text"
                placeholder="e.g., Cheeseburger, Latte, Caesar Salad..."
                style={styles.input}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description (Optional)</label>
              <textarea
                placeholder="Describe your item..."
                style={styles.textarea}
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div style={styles.section} className="add-item-section">
            <div style={styles.sectionTitle} className="add-item-section-title">
              <Folder size={18} />
              Category & Subcategory
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Category *</label>
              <select
                style={styles.select}
                value={isCreatingNewCategory ? 'new_category' : selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Choose category...</option>
                <option value="subs">Subs</option>
                <option value="drinks">Drinks</option>
                <option value="hots">Hots</option>
                <option value="saladrolls">Salad Rolls</option>
                {existingCategories
                  .filter(cat => !['subs', 'drinks', 'hots', 'saladrolls', 'coffee', 'fruittea', 'milktea'].includes(cat.id))
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                <option value="new_category">+ Create New Category</option>
              </select>
            </div>

            {isCreatingNewCategory && (
              <div style={styles.subsection}>
                <div style={styles.subsectionTitle}>
                  <Plus size={14} />
                  New Category
                </div>
                <input
                  type="text"
                  placeholder="e.g., Desserts, Appetizers, Sides..."
                  style={styles.input}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
            )}

            {isDrinksCategory && !isCreatingNewCategory && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Drink Type *</label>
                  <select
                    style={styles.select}
                    value={isCreatingCustomDrink ? 'custom_drink' : selectedSubcategory}
                    onChange={(e) => handleDrinkSubcategoryChange(e.target.value)}
                  >
                    <option value="">Select type...</option>
                    {drinkSubcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                    <option value="custom_drink">+ Add Custom Drink Type</option>
                  </select>
                </div>

                {isCreatingCustomDrink && (
                  <div style={styles.subsection}>
                    <div style={styles.subsectionTitle}>
                      <FolderTree size={14} />
                      Custom Drink Type
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., Smoothies, Shakes, Fresh Juice, Soda..."
                      style={styles.input}
                      value={newSubcategoryName}
                      onChange={(e) => setNewSubcategoryName(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {(selectedCategory || isCreatingNewCategory) && !isDrinksCategory && (
              <>
                <div style={styles.formGroup}>
                  <div 
                    style={styles.checkboxGroup}
                    onClick={() => setIsCreatingNewSubcategory(!isCreatingNewSubcategory)}
                  >
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={isCreatingNewSubcategory}
                      onChange={(e) => setIsCreatingNewSubcategory(e.target.checked)}
                    />
                    <label style={styles.checkboxLabel}>
                      Create a subcategory
                    </label>
                  </div>
                </div>

                {isCreatingNewSubcategory && (
                  <div style={styles.subsection}>
                    <div style={styles.subsectionTitle}>
                      <FolderTree size={14} />
                      Subcategory
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., Toppings, Sauces, Sizes, Extras..."
                      style={styles.input}
                      value={newSubcategoryName}
                      onChange={(e) => setNewSubcategoryName(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pricing */}
          <div style={styles.section} className="add-item-section">
            <div style={styles.sectionTitle} className="add-item-section-title">
              <DollarSign size={18} />
              Pricing
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Pricing Type *</label>
              <div style={styles.radioGroup} className="add-item-radio-group">
                <div
                  style={styles.radioOption(pricingType === 'fixed')}
                  onClick={() => setPricingType('fixed')}
                  className="add-item-radio-option"
                >
                  Fixed Price
                </div>
                <div
                  style={styles.radioOption(pricingType === 'sizes')}
                  onClick={() => setPricingType('sizes')}
                  className="add-item-radio-option"
                >
                  Multiple Sizes
                </div>
              </div>
            </div>

            {pricingType === 'fixed' ? (
              <div style={styles.formGroup}>
                <label style={styles.label}>Price ({SETTINGS.currency}) *</label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  style={styles.input}
                  value={fixedPrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                />
              </div>
            ) : (
              <div style={styles.formGroup}>
                <label style={styles.label}>Size Options *</label>
                {customSizes.map((size, index) => (
                  <div key={index} style={styles.sizeRow} className="add-item-size-row">
                    <input
                      type="text"
                      placeholder="Size name"
                      style={styles.input}
                      value={size.name}
                      onChange={(e) => updateSize(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Price"
                      style={styles.input}
                      value={size.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                          updateSize(index, 'price', value);
                        }
                      }}
                    />
                    {customSizes.length > 1 && (
                      <button
                        style={styles.removeBtn}
                        onClick={() => removeSize(index)}
                        className="add-item-remove-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button style={styles.addBtn} onClick={addSize}>
                  <Plus size={16} />
                  Add Size
                </button>
              </div>
            )}
          </div>

          {/* Modifiers/Toppings */}
          <div style={styles.section} className="add-item-section">
            <div style={styles.sectionTitle} className="add-item-section-title">
              <List size={18} />
              Toppings & Modifiers
            </div>
            
            <div style={styles.formGroup}>
              <div 
                style={styles.checkboxGroup}
                onClick={() => setHasModifiers(!hasModifiers)}
              >
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={hasModifiers}
                  onChange={(e) => setHasModifiers(e.target.checked)}
                />
                <label style={styles.checkboxLabel}>
                  This item has customizable options
                </label>
              </div>
            </div>

            {hasModifiers && (
              <>
                {modifierGroups.map((group, groupIndex) => (
                  <div key={group.id} style={styles.modifierGroup}>
                    <div style={styles.modifierGroupHeader}>
                      <input
                        type="text"
                        placeholder="Group name (e.g., Toppings, Size, Extras)"
                        style={{ ...styles.input, ...styles.smallInput, marginBottom: 0 }}
                        value={group.title}
                        onChange={(e) => updateModifierGroup(groupIndex, 'title', e.target.value)}
                      />
                      {modifierGroups.length > 1 && (
                        <button
                          style={{ ...styles.removeBtn, marginLeft: '8px' }}
                          onClick={() => removeModifierGroup(groupIndex)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={group.multiSelect}
                        onChange={(e) => updateModifierGroup(groupIndex, 'multiSelect', e.target.checked)}
                      />
                      <label style={styles.checkboxLabel}>
                        Allow multiple selections
                      </label>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      {group.options.map((option, optionIndex) => (
                        <div key={option.id} style={styles.modifierOptionRow} className="add-item-modifier-option-row">
                          <input
                            type="text"
                            placeholder="Option name"
                            style={{ ...styles.input, ...styles.smallInput }}
                            value={option.name}
                            onChange={(e) => updateModifierOption(groupIndex, optionIndex, 'name', e.target.value)}
                          />
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Price"
                            style={{ ...styles.input, ...styles.smallInput }}
                            value={option.price}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                updateModifierOption(groupIndex, optionIndex, 'price', value);
                              }
                            }}
                          />
                          {group.options.length > 1 && (
                            <button
                              style={{ ...styles.removeBtn, width: '32px', height: '32px' }}
                              onClick={() => removeModifierOption(groupIndex, optionIndex)}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button 
                        style={{ ...styles.addBtn, padding: '8px', fontSize: '12px' }} 
                        onClick={() => addModifierOption(groupIndex)}
                      >
                        <Plus size={14} />
                        Add Option
                      </button>
                    </div>
                  </div>
                ))}

                <button style={styles.addBtn} onClick={addModifierGroup}>
                  <Plus size={16} />
                  Add Modifier Group
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer} className="add-item-footer">
          <button
            style={styles.button('secondary')}
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            className="add-item-btn"
          >
            Cancel
          </button>
          <button
            style={styles.button('primary')}
            onClick={handleAddItem}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            className="add-item-btn"
          >
            <Plus size={18} />
            Add to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomItemModal;