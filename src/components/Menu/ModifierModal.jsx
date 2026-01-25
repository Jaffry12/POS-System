import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePOS } from '../../hooks/usePOS';
import { SETTINGS, SUB_MODIFIERS, DRINK_MODIFIERS } from '../../data/menuData';

const ModifierModal = ({ item, onClose }) => {
  const { theme } = useTheme();
  const { addToOrder } = usePOS();
  
  // Determine item type
  const hasSizes = item.prices && typeof item.prices === 'object';
  const isDrink = item.category === 'fruittea' || item.category === 'milktea';
  const isSub = item.category === 'subs';
  const hasModifiers = item.hasModifiers;
  
  // State management
  const [step, setStep] = useState(hasSizes ? 1 : (hasModifiers ? 2 : 0));
  const [selectedSize, setSelectedSize] = useState(hasSizes ? Object.keys(item.prices)[0] : null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);

  // Calculate prices
  const getBasePrice = () => {
    if (hasSizes && selectedSize) {
      return item.prices[selectedSize];
    }
    return item.price || 0;
  };

  const getModifiersTotal = () => {
    return selectedModifiers.reduce((sum, group) => {
      return sum + group.options.reduce((s, opt) => s + (opt.price || 0), 0);
    }, 0);
  };

  const getTotalPrice = () => {
    return getBasePrice() + getModifiersTotal();
  };

  // Handle modifier selection
  const toggleModifier = (groupId, groupTitle, option, multiSelect) => {
    setSelectedModifiers(prev => {
      const groupIndex = prev.findIndex(g => g.groupId === groupId);
      
      if (groupIndex === -1) {
        return [...prev, {
          groupId,
          groupTitle,
          options: [option],
        }];
      }

      const group = prev[groupIndex];
      const optionIndex = group.options.findIndex(o => o.id === option.id);

      if (multiSelect) {
        if (optionIndex >= 0) {
          const newOptions = group.options.filter(o => o.id !== option.id);
          if (newOptions.length === 0) {
            return prev.filter(g => g.groupId !== groupId);
          }
          const newGroups = [...prev];
          newGroups[groupIndex] = { ...group, options: newOptions };
          return newGroups;
        } else {
          const newGroups = [...prev];
          newGroups[groupIndex] = {
            ...group,
            options: [...group.options, option],
          };
          return newGroups;
        }
      } else {
        const newGroups = [...prev];
        newGroups[groupIndex] = {
          ...group,
          options: [option],
        };
        return newGroups;
      }
    });
  };

  const isOptionSelected = (groupId, optionId) => {
    const group = selectedModifiers.find(g => g.groupId === groupId);
    return group?.options.some(o => o.id === optionId) || false;
  };

  // Navigation
  const handleNext = () => {
    if (isSub) {
      if (step === 1 && hasSizes) setStep(2);
      else if (step === 2) setStep(3);
      else handleAddToOrder();
    } else if (isDrink) {
      if (step === 1) setStep(2);
      else handleAddToOrder();
    } else {
      handleAddToOrder();
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    if (isSub && step === 2) setStep(3);
    else if (isSub && step === 3) handleAddToOrder();
    else if (isDrink && step === 2) handleAddToOrder();
  };

  const handleAddToOrder = () => {
    addToOrder(item, selectedSize, selectedModifiers);
    onClose();
  };

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
      zIndex: 1000,
    },
    modal: {
      background: theme.cardBg,
      borderRadius: '16px',
      width: '700px',
      maxWidth: '95vw',
      height: '85vh',
      maxHeight: '800px',
      boxShadow: theme.shadowLarge,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: `2px solid ${theme.border}`,
      flexShrink: 0,
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    backButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: theme.textSecondary,
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
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
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px',
      // Hide scrollbar
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
    itemInfo: {
      padding: '16px',
      background: theme.bgSecondary,
      borderRadius: '12px',
      marginBottom: '24px',
    },
    itemName: {
      fontSize: '18px',
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: '4px',
    },
    itemPrice: {
      fontSize: '16px',
      fontWeight: '600',
      color: theme.primary,
    },
    sectionLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: '12px',
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginBottom: '24px',
    },
    optionButton: (isSelected) => ({
      padding: '16px',
      border: `2px solid ${isSelected ? theme.primary : theme.border}`,
      borderRadius: '12px',
      background: isSelected ? `${theme.primary}15` : theme.cardBg,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left',
    }),
    optionName: {
      fontSize: '14px',
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: '4px',
    },
    optionPrice: (price) => ({
      fontSize: '13px',
      fontWeight: '600',
      color: price > 0 ? theme.success : theme.textLight,
    }),
    footer: {
      padding: '20px 24px',
      borderTop: `2px solid ${theme.border}`,
      flexShrink: 0,
      background: theme.cardBg,
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    button: (variant) => ({
      flex: 1,
      padding: '14px',
      border: 'none',
      borderRadius: '10px',
      background: variant === 'primary' ? theme.primary : theme.bgSecondary,
      color: variant === 'primary' ? '#FFFFFF' : theme.textSecondary,
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  };

  const renderSizeSelection = () => (
    <>
      <div style={styles.sectionLabel}>Select Size:</div>
      <div style={styles.optionsGrid}>
        {Object.keys(item.prices).map((size) => (
          <button
            key={size}
            style={styles.optionButton(selectedSize === size)}
            onClick={() => setSelectedSize(size)}
          >
            <div style={styles.optionName}>{size}</div>
            <div style={styles.optionPrice(item.prices[size])}>
              {SETTINGS.currency}{(item.prices[size] / 100).toFixed(2)}
            </div>
          </button>
        ))}
      </div>
    </>
  );

  const renderModifierGroup = (modifierGroup) => (
    <>
      <div style={styles.sectionLabel}>{modifierGroup.groupTitle}:</div>
      <div style={styles.optionsGrid}>
        {modifierGroup.options.map((option) => {
          const isSelected = isOptionSelected(modifierGroup.groupId, option.id);
          return (
            <button
              key={option.id}
              style={styles.optionButton(isSelected)}
              onClick={() => toggleModifier(
                modifierGroup.groupId,
                modifierGroup.groupTitle,
                option,
                modifierGroup.multiSelect
              )}
            >
              <div style={styles.optionName}>{option.name}</div>
              <div style={styles.optionPrice(option.price)}>
                {option.price > 0 ? `+${SETTINGS.currency}${(option.price / 100).toFixed(2)}` : 'FREE'}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  const getStepTitle = () => {
    if (hasSizes && step === 1) return 'Select Size';
    if (isSub && step === 2) return 'Sub Toppings';
    if (isSub && step === 3) return 'Extras';
    if (isDrink && step === 2) return 'Toppings';
    return 'Customize';
  };

  if (!hasModifiers && !hasSizes) {
    handleAddToOrder();
    return null;
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            {step > 1 && (
              <button style={styles.backButton} onClick={handlePrevious}>
                <ChevronLeft size={24} />
              </button>
            )}
            <div style={styles.title}>{getStepTitle()}</div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          style={styles.content}
          // Hide scrollbar for webkit browsers
          className="hide-scrollbar"
        >
          <div style={styles.itemInfo}>
            <div style={styles.itemName}>{item.name}</div>
            <div style={styles.itemPrice}>
              {SETTINGS.currency}{(getTotalPrice() / 100).toFixed(2)}
            </div>
          </div>

          {hasSizes && step === 1 && renderSizeSelection()}
          {isSub && step === 2 && renderModifierGroup(SUB_MODIFIERS.subToppings)}
          {isSub && step === 3 && renderModifierGroup(SUB_MODIFIERS.extras)}
          {isDrink && step === 2 && renderModifierGroup(DRINK_MODIFIERS.toppings)}
        </div>

        {/* Fixed Footer */}
        <div style={styles.footer}>
          <div style={styles.buttonGroup}>
            {step > 1 && (
              <button
                style={styles.button('secondary')}
                onClick={handleSkip}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Skip
              </button>
            )}
            <button
              style={styles.button('primary')}
              onClick={handleNext}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {(isSub && step < 3) || (isDrink && step === 1) ? 'Next' : 'Add to Order'}
            </button>
          </div>
        </div>

        {/* CSS to hide scrollbar */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ModifierModal;