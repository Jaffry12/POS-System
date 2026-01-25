import { useState, useMemo } from "react";
import { X, ChevronLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { SETTINGS, SUB_MODIFIERS, DRINK_MODIFIERS } from "../../data/menuData";

const ModifierModal = ({ item, onClose }) => {
  const { theme } = useTheme();
  const { addToOrder } = usePOS();

  // Determine item type
  const hasSizes = item.prices && typeof item.prices === "object";
  const isDrink =
    item.category === "fruittea" ||
    item.category === "milktea" ||
    item.category === "coffee";
  const isSub = item.category === "subs";
  const hasModifiers = item.hasModifiers;

  const initialStep = useMemo(() => {
    if (hasSizes) return 1;
    if (hasModifiers) {
      if (isSub) return 2;
      if (isDrink) return 2;
      return 2;
    }
    return 0;
  }, [hasSizes, hasModifiers, isSub, isDrink]);

  const [step, setStep] = useState(initialStep);
  const [selectedSize, setSelectedSize] = useState(
    hasSizes ? Object.keys(item.prices)[0] : null
  );
  const [selectedModifiers, setSelectedModifiers] = useState([]);

  // Calculate prices
  const getBasePrice = () => {
    if (hasSizes && selectedSize) return item.prices[selectedSize];
    return item.price || 0;
  };

  const getModifiersTotal = () => {
    return selectedModifiers.reduce((sum, group) => {
      return sum + group.options.reduce((s, opt) => s + (opt.price || 0), 0);
    }, 0);
  };

  const getTotalPrice = () => getBasePrice() + getModifiersTotal();

  // Handle modifier selection
  const toggleModifier = (groupId, groupTitle, option, multiSelect) => {
    setSelectedModifiers((prev) => {
      const groupIndex = prev.findIndex((g) => g.groupId === groupId);

      if (groupIndex === -1) {
        return [
          ...prev,
          {
            groupId,
            groupTitle,
            options: [option],
          },
        ];
      }

      const group = prev[groupIndex];
      const optionIndex = group.options.findIndex((o) => o.id === option.id);

      if (multiSelect) {
        if (optionIndex >= 0) {
          const newOptions = group.options.filter((o) => o.id !== option.id);
          if (newOptions.length === 0) {
            return prev.filter((g) => g.groupId !== groupId);
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
    const group = selectedModifiers.find((g) => g.groupId === groupId);
    return group?.options.some((o) => o.id === optionId) || false;
  };

  // Helpers: step mapping
  const isConfirmStep = step === 4 || (isDrink && step === 3) || (!isSub && !isDrink && step === 2 && hasSizes);

  const goToConfirm = () => {
    if (isSub) setStep(4);
    else if (isDrink) setStep(hasSizes ? 3 : 3);
    else {
      setStep(hasSizes ? 2 : 2);
    }
  };

  // Navigation
  const handleNext = () => {
    if (isSub) {
      if (hasSizes && step === 1) return setStep(2);
      if (step === 2) return setStep(3);
      if (step === 3) return setStep(4);
      if (step === 4) return handleAddToOrder();
    }

    if (isDrink) {
      if (hasSizes && step === 1) return setStep(2);
      if (step === 2) return setStep(3);
      if (step === 3) return handleAddToOrder();
    }

    if (hasSizes && step === 1) return goToConfirm();
    if (step === 2) return handleAddToOrder();

    handleAddToOrder();
  };

  const handlePrevious = () => {
    if (isSub) {
      if (step === 4) return setStep(3);
      if (step === 3) return setStep(2);
      if (step === 2) return setStep(hasSizes ? 1 : 2);
      if (step === 1) return;
    }

    if (isDrink) {
      if (step === 3) return setStep(2);
      if (step === 2) return setStep(hasSizes ? 1 : 2);
      if (step === 1) return;
    }

    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    if (isSub) {
      if (step === 2) return setStep(3);
      if (step === 3) return setStep(4);
      return;
    }

    if (isDrink) {
      if (step === 2) return setStep(3);
      return;
    }
  };

  // Final actions
  const handleAddToOrder = () => {
    addToOrder(item, selectedSize, selectedModifiers);
    onClose();
  };

  const handleDiscard = () => {
    onClose();
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      background: theme.cardBg,
      borderRadius: "16px",
      width: "700px",
      maxWidth: "95vw",
      height: "85vh",
      maxHeight: "800px",
      boxShadow: theme.shadowLarge,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 24px",
      borderBottom: `2px solid ${theme.border}`,
      flexShrink: 0,
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    backButton: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: theme.textSecondary,
      padding: "4px",
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: theme.textPrimary,
    },
    closeButton: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: theme.textSecondary,
      padding: "4px",
    },
    content: {
      flex: 1,
      overflowY: "auto",
      padding: "24px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    itemInfo: {
      padding: "16px",
      background: theme.bgSecondary,
      borderRadius: "12px",
      marginBottom: "24px",
    },
    itemName: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: "4px",
    },
    itemPrice: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.primary,
    },
    sectionLabel: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: "12px",
    },
    optionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px",
      marginBottom: "24px",
    },
    optionButton: (isSelected) => ({
      padding: "16px",
      border: `2px solid ${isSelected ? theme.primary : theme.border}`,
      borderRadius: "12px",
      background: isSelected ? `${theme.primary}15` : theme.cardBg,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "left",
    }),
    optionName: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: "4px",
    },
    optionPrice: (price) => ({
      fontSize: "13px",
      fontWeight: "600",
      color: price > 0 ? theme.success : theme.textLight,
    }),
    summaryCard: {
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "16px",
      background: theme.bgSecondary,
      marginBottom: "16px",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      padding: "8px 0",
      borderBottom: `1px solid ${theme.border}`,
    },
    summaryRowLast: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      padding: "8px 0",
    },
    summaryLabel: {
      color: theme.textSecondary,
      fontSize: "13px",
      fontWeight: "600",
    },
    summaryValue: {
      color: theme.textPrimary,
      fontSize: "13px",
      fontWeight: "600",
      textAlign: "right",
    },
    chipRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "8px",
    },
    chip: {
      padding: "6px 10px",
      borderRadius: "999px",
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      color: theme.textSecondary,
      fontSize: "12px",
      fontWeight: "600",
    },
    footer: {
      padding: "20px 24px",
      borderTop: `2px solid ${theme.border}`,
      flexShrink: 0,
      background: theme.cardBg,
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
    },
    button: (variant) => ({
      flex: 1,
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      background: variant === "primary" ? theme.primary : theme.bgSecondary,
      color: variant === "primary" ? "#FFFFFF" : theme.textSecondary,
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }),
    dangerButton: {
      flex: 1,
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      background: theme.danger || "#e11d48",
      color: "#FFFFFF",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  };

  const renderSizeSelection = () => (
    <>
      <div style={styles.sectionLabel}>Select Size:</div>
      <div style={styles.optionsGrid} className="modifier-options-grid">
        {Object.keys(item.prices).map((size) => (
          <button
            key={size}
            style={styles.optionButton(selectedSize === size)}
            onClick={() => setSelectedSize(size)}
            className="modifier-option-btn"
          >
            <div style={styles.optionName}>{size}</div>
            <div style={styles.optionPrice(item.prices[size])}>
              {SETTINGS.currency}
              {(item.prices[size] / 100).toFixed(2)}
            </div>
          </button>
        ))}
      </div>
    </>
  );

  const renderModifierGroup = (modifierGroup) => (
    <>
      <div style={styles.sectionLabel}>{modifierGroup.groupTitle}:</div>
      <div style={styles.optionsGrid} className="modifier-options-grid">
        {modifierGroup.options.map((option) => {
          const selected = isOptionSelected(modifierGroup.groupId, option.id);
          return (
            <button
              key={option.id}
              style={styles.optionButton(selected)}
              onClick={() =>
                toggleModifier(
                  modifierGroup.groupId,
                  modifierGroup.groupTitle,
                  option,
                  modifierGroup.multiSelect
                )
              }
              className="modifier-option-btn"
            >
              <div style={styles.optionName}>{option.name}</div>
              <div style={styles.optionPrice(option.price)}>
                {option.price > 0
                  ? `+${SETTINGS.currency}${(option.price / 100).toFixed(2)}`
                  : "FREE"}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  const renderConfirmation = () => {
    const sizeText = hasSizes && selectedSize ? selectedSize : "Default";
    const groups = selectedModifiers;

    return (
      <>
        <div style={styles.sectionLabel}>Confirm Order</div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryRow}>
            <div style={styles.summaryLabel}>Item</div>
            <div style={styles.summaryValue}>{item.name}</div>
          </div>

          <div style={styles.summaryRow}>
            <div style={styles.summaryLabel}>Size</div>
            <div style={styles.summaryValue}>{sizeText}</div>
          </div>

          <div style={styles.summaryRow}>
            <div style={styles.summaryLabel}>Base Price</div>
            <div style={styles.summaryValue}>
              {SETTINGS.currency}
              {(getBasePrice() / 100).toFixed(2)}
            </div>
          </div>

          <div style={styles.summaryRow}>
            <div style={styles.summaryLabel}>Extras / Toppings</div>
            <div style={styles.summaryValue}>
              {SETTINGS.currency}
              {(getModifiersTotal() / 100).toFixed(2)}
            </div>
          </div>

          <div style={styles.summaryRowLast}>
            <div style={{ ...styles.summaryLabel, fontSize: "14px" }}>
              Total
            </div>
            <div
              style={{
                ...styles.summaryValue,
                fontSize: "14px",
                color: theme.primary,
              }}
            >
              {SETTINGS.currency}
              {(getTotalPrice() / 100).toFixed(2)}
            </div>
          </div>
        </div>

        {groups.length > 0 ? (
          groups.map((g) => (
            <div key={g.groupId} style={{ marginBottom: "16px" }}>
              <div style={styles.sectionLabel}>{g.groupTitle}</div>
              <div style={styles.chipRow}>
                {g.options.map((o) => (
                  <span key={o.id} style={styles.chip}>
                    {o.name}
                    {o.price > 0
                      ? ` (+${SETTINGS.currency}${(o.price / 100).toFixed(2)})`
                      : ""}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: theme.textSecondary, fontSize: "14px" }}>
            No toppings/extras selected.
          </div>
        )}
      </>
    );
  };

  const getStepTitle = () => {
    if (hasSizes && step === 1) return "Select Size";
    if (isSub && step === 2) return "Sub Toppings";
    if (isSub && step === 3) return "Extras";
    if (isSub && step === 4) return "Confirm";
    if (isDrink && step === 2) return "Toppings";
    if (isDrink && step === 3) return "Confirm";
    if (step === 2) return "Confirm";
    return "Customize";
  };

  // If no modifiers and no sizes, add immediately
  if (!hasModifiers && !hasSizes) {
    addToOrder(item, null, []);
    onClose();
    return null;
  }

  return (
    <div style={styles.overlay} onClick={onClose} className="modifier-modal-overlay">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* 📱 Tablet (768px - 1024px) */
        @media (max-width: 1024px) and (min-width: 768px) {
          .modifier-modal {
            width: 650px !important;
            height: 80vh !important;
          }
          .modifier-header {
            padding: 18px 20px !important;
          }
          .modifier-title {
            font-size: 18px !important;
          }
          .modifier-content {
            padding: 20px !important;
          }
          .modifier-footer {
            padding: 18px 20px !important;
          }
        }

        /* 📱 Mobile (480px - 768px) */
        @media (max-width: 768px) {
          .modifier-modal {
            width: 100% !important;
            height: 90vh !important;
            max-height: 90vh !important;
            border-radius: 16px 16px 0 0 !important;
            margin-top: auto !important;
          }
          .modifier-modal-overlay {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .modifier-header {
            padding: 16px !important;
          }
          .modifier-title {
            font-size: 17px !important;
          }
          .modifier-content {
            padding: 16px !important;
          }
          .modifier-item-info {
            padding: 14px !important;
            margin-bottom: 20px !important;
          }
          .modifier-item-name {
            font-size: 16px !important;
          }
          .modifier-item-price {
            font-size: 15px !important;
          }
          .modifier-section-label {
            font-size: 15px !important;
            margin-bottom: 10px !important;
          }
          .modifier-options-grid {
            gap: 10px !important;
            margin-bottom: 20px !important;
          }
          .modifier-option-btn {
            padding: 14px !important;
          }
          .modifier-footer {
            padding: 16px !important;
          }
          .modifier-button-group {
            gap: 10px !important;
          }
          .modifier-btn {
            padding: 13px !important;
            font-size: 15px !important;
          }
        }

        /* 📱 Small Mobile (< 480px) */
        @media (max-width: 480px) {
          .modifier-header {
            padding: 14px 12px !important;
          }
          .modifier-title {
            font-size: 16px !important;
          }
          .modifier-content {
            padding: 12px !important;
          }
          .modifier-item-info {
            padding: 12px !important;
            margin-bottom: 16px !important;
          }
          .modifier-item-name {
            font-size: 15px !important;
          }
          .modifier-item-price {
            font-size: 14px !important;
          }
          .modifier-section-label {
            font-size: 14px !important;
            margin-bottom: 8px !important;
          }
          .modifier-options-grid {
            gap: 8px !important;
            margin-bottom: 16px !important;
          }
          .modifier-option-btn {
            padding: 12px !important;
          }
          .modifier-option-name {
            font-size: 13px !important;
          }
          .modifier-option-price {
            font-size: 12px !important;
          }
          .modifier-footer {
            padding: 14px 12px !important;
          }
          .modifier-button-group {
            gap: 8px !important;
          }
          .modifier-btn {
            padding: 12px !important;
            font-size: 14px !important;
          }
        }
      `}</style>

      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="modifier-modal">
        {/* Header */}
        <div style={styles.header} className="modifier-header">
          <div style={styles.headerLeft}>
            {step > 1 && (
              <button style={styles.backButton} onClick={handlePrevious}>
                <ChevronLeft size={24} />
              </button>
            )}
            <div style={styles.title} className="modifier-title">{getStepTitle()}</div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={styles.content} className="hide-scrollbar modifier-content">
          <div style={styles.itemInfo} className="modifier-item-info">
            <div style={styles.itemName} className="modifier-item-name">{item.name}</div>
            <div style={styles.itemPrice} className="modifier-item-price">
              {SETTINGS.currency}
              {(getTotalPrice() / 100).toFixed(2)}
            </div>
          </div>

          {hasSizes && step === 1 && renderSizeSelection()}

          {isSub && step === 2 && renderModifierGroup(SUB_MODIFIERS.subToppings)}
          {isSub && step === 3 && renderModifierGroup(SUB_MODIFIERS.extras)}
          {isSub && step === 4 && renderConfirmation()}

          {isDrink && step === 2 && renderModifierGroup(DRINK_MODIFIERS.toppings)}
          {isDrink && step === 3 && renderConfirmation()}

          {!isSub && !isDrink && hasSizes && step === 2 && renderConfirmation()}
        </div>

        {/* Footer */}
        <div style={styles.footer} className="modifier-footer">
          <div style={styles.buttonGroup} className="modifier-button-group">
            {!isConfirmStep && step > 1 && (
              <button
                style={styles.button("secondary")}
                onClick={handleSkip}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                className="modifier-btn"
              >
                Skip
              </button>
            )}

            {isConfirmStep ? (
              <>
                <button
                  style={styles.dangerButton}
                  onClick={handleDiscard}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  className="modifier-btn"
                >
                  Discard
                </button>
                <button
                  style={styles.button("primary")}
                  onClick={handleAddToOrder}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  className="modifier-btn"
                >
                  Add to Order
                </button>
              </>
            ) : (
              <button
                style={styles.button("primary")}
                onClick={handleNext}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                className="modifier-btn"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierModal;