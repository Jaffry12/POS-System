import { useState, useMemo, useEffect, useRef } from "react";
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
  const isHot = item.category === "hots";
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

  // ✅ Light Toppings group (built from Sub Toppings)
  const LIGHT_TOPPINGS_GROUP = useMemo(() => {
    const base = SUB_MODIFIERS?.subToppings;
    const baseOptions = Array.isArray(base?.options) ? base.options : [];

    const normalize = (str) =>
      String(str || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    const mapped = baseOptions
      .map((opt) => {
        const rawName = String(opt?.name || "").trim();
        if (!rawName) return null;

        const baseName = rawName.replace(/^no\s+/i, "").trim();
        const finalName = baseName ? `Light ${baseName}` : `Light ${rawName}`;

        const key = normalize(baseName || rawName);
        return {
          ...opt,
          id: `light_${key || opt.id}`,
          name: finalName,
          price: 0,
        };
      })
      .filter(Boolean);

    return {
      groupId: "light_toppings",
      groupTitle: "Light Toppings",
      multiSelect: true,
      options: mapped,
    };
  }, []);

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

  // ✅ NEW: Clear modifiers for current step
  const clearCurrentStepModifiers = () => {
    setSelectedModifiers((prev) => {
      let groupIdToClear = null;

      if (isSub) {
        if (step === 2) groupIdToClear = "sub-toppings";
        if (step === 3) groupIdToClear = "light_toppings";
        if (step === 4) groupIdToClear = "extras";
      } else if (isDrink) {
        if (step === 2) groupIdToClear = "toppings";
      }

      if (groupIdToClear) {
        return prev.filter((g) => g.groupId !== groupIdToClear);
      }

      return prev;
    });
  };

  // Helpers: step mapping
  const isConfirmStep =
    step === 5 ||
    (isDrink && step === 3) ||
    (isHot && step === 2) ||
    (!isSub && !isDrink && !isHot && step === 2 && hasSizes);

  const goToConfirm = () => {
    if (isSub) setStep(5);
    else if (isDrink) setStep(hasSizes ? 3 : 3);
    else if (isHot) setStep(hasSizes ? 2 : 2);
    else {
      setStep(hasSizes ? 2 : 2);
    }
  };

  const autoAddedRef = useRef(false);

  useEffect(() => {
    if (hasModifiers || hasSizes) return;

    if (autoAddedRef.current) return;
    autoAddedRef.current = true;

    addToOrder(item, null, []);
    onClose();
  }, [hasModifiers, hasSizes, addToOrder, item, onClose]);

  // Navigation
  const handleNext = () => {
    if (isSub) {
      if (hasSizes && step === 1) return setStep(2);
      if (step === 2) return setStep(3);
      if (step === 3) return setStep(4);
      if (step === 4) return setStep(5);
      if (step === 5) return handleAddToOrder();
    }

    if (isDrink) {
      if (hasSizes && step === 1) return setStep(2);
      if (step === 2) return setStep(3);
      if (step === 3) return handleAddToOrder();
    }

    if (isHot) {
      if (hasSizes && step === 1) return setStep(2);
      if (step === 2) return handleAddToOrder();
    }

    if (hasSizes && step === 1) return goToConfirm();
    if (step === 2) return handleAddToOrder();

    handleAddToOrder();
  };

  const handlePrevious = () => {
    if (isSub) {
      if (step === 5) return setStep(4);
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

    if (isHot) {
      if (step === 2) return setStep(hasSizes ? 1 : 2);
      if (step === 1) return;
    }

    if (step > 1) setStep(step - 1);
  };

  // ✅ FIXED: Skip now clears current step selections before moving to next step
  const handleSkip = () => {
    clearCurrentStepModifiers();

    if (isSub) {
      if (step === 2) return setStep(3);
      if (step === 3) return setStep(4);
      if (step === 4) return setStep(5);
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
    optionButton: (selected) => ({
      padding: "16px",
      background: selected ? theme.primary : theme.bgSecondary,
      color: selected ? "#fff" : theme.textPrimary,
      border: `2px solid ${selected ? theme.primary : theme.border}`,
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.2s",
      minHeight: "70px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    }),
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 24px",
      borderTop: `2px solid ${theme.border}`,
      flexShrink: 0,
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      width: "100%",
    },
    button: (variant) => ({
      flex: 1,
      padding: "16px 24px",
      background: variant === "primary" ? theme.primary : theme.bgSecondary,
      color: variant === "primary" ? "#fff" : theme.textPrimary,
      border: "none",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "16px",
      cursor: "pointer",
      transition: "all 0.2s",
      minHeight: "56px",
    }),
    dangerButton: {
      flex: 1,
      padding: "16px 24px",
      background: "#EF4444",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "16px",
      cursor: "pointer",
      transition: "all 0.2s",
      minHeight: "56px",
    },
    chipRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "8px",
    },
    chip: {
      display: "inline-block",
      padding: "6px 12px",
      background: theme.bgSecondary,
      borderRadius: "8px",
      fontSize: "14px",
      color: theme.textPrimary,
    },
  };

  // Size selection renderer
  const renderSizeSelection = () => {
    const sizes = Object.keys(item.prices);
    return (
      <>
        <div style={styles.sectionLabel} className="modifier-section-label">
          Select Size
        </div>
        <div style={styles.optionsGrid} className="modifier-options-grid">
          {sizes.map((size) => (
            <button
              key={size}
              style={styles.optionButton(selectedSize === size)}
              onClick={() => setSelectedSize(size)}
              className="modifier-option-btn"
            >
              <div>{size}</div>
              <div style={{ fontSize: "13px", opacity: 0.9 }}>
                {SETTINGS.currency}
                {(item.prices[size] / 100).toFixed(2)}
              </div>
            </button>
          ))}
        </div>
      </>
    );
  };

  const renderModifierGroup = (group, forceMultiSelect = false) => {
    const multi = forceMultiSelect ? true : !!group.multiSelect;

    return (
      <>
        <div style={styles.sectionLabel} className="modifier-section-label">
          {group.groupTitle}
        </div>
        <div style={styles.optionsGrid} className="modifier-options-grid">
          {group.options.map((option) => {
            const isSelected = isOptionSelected(group.groupId, option.id);
            return (
              <button
                key={option.id}
                style={styles.optionButton(isSelected)}
                onClick={() =>
                  toggleModifier(group.groupId, group.groupTitle, option, multi)
                }
                className="modifier-option-btn"
              >
                <div>{option.name}</div>
                {option.price > 0 && (
                  <div style={{ fontSize: "13px", opacity: 0.9 }}>
                    +{SETTINGS.currency}
                    {(option.price / 100).toFixed(2)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  // Confirmation renderer
  const renderConfirmation = () => {
    const groups = selectedModifiers.filter((g) => g.options.length > 0);

    return (
      <>
        <div
          style={{
            padding: "16px",
            background: theme.bgSecondary,
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "14px", color: theme.textSecondary }}>
              {selectedSize && `Size: ${selectedSize}`}
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
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
    if (isSub && step === 3) return "Light Toppings";
    if (isSub && step === 4) return "Extras";
    if (isSub && step === 5) return "Confirm";
    if (isDrink && step === 2) return "Toppings";
    if (isDrink && step === 3) return "Confirm";
    if (isHot && step === 2) return "Confirm";
    if (step === 2) return "Confirm";
    return "Customize";
  };

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
      className="modifier-modal-overlay"
    >
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

  /* ✅ Mobile (<= 768px) — CENTER POPUP */
  @media (max-width: 768px) {
    .modifier-modal-overlay {
      align-items: center !important;
      justify-content: center !important;
      padding: 12px !important;
    }

    .modifier-modal {
      width: min(520px, 94vw) !important;
      height: auto !important;
      max-height: 90vh !important;
      max-width: 94vw !important;
      border-radius: 16px !important;
      margin: 0 !important;
    }

    .modifier-header {
      padding: 14px 16px !important;
    }
    .modifier-header-left {
      gap: 8px !important;
    }
    .modifier-title {
      font-size: 16px !important;
    }
    .modifier-content {
      padding: 16px !important;
    }
    .modifier-item-info {
      padding: 12px !important;
      margin-bottom: 18px !important;
    }
    .modifier-item-name {
      font-size: 15px !important;
      margin-bottom: 4px !important;
    }
    .modifier-item-price {
      font-size: 14px !important;
    }
    .modifier-section-label {
      font-size: 14px !important;
      margin-bottom: 10px !important;
    }
    .modifier-options-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
      margin-bottom: 18px !important;
    }
    .modifier-option-btn {
      padding: 12px 10px !important;
      min-height: 64px !important;
    }
    .modifier-footer {
      padding: 14px 16px !important;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
    }
    .modifier-button-group {
      gap: 10px !important;
    }
    .modifier-btn {
      padding: 14px 16px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      min-height: 48px !important;
    }
  }

  /* 📱 Small Mobile (< 480px) */
  @media (max-width: 480px) {
    .modifier-modal-overlay {
      padding: 10px !important;
    }

    .modifier-modal {
      width: 94vw !important;
      max-height: 90vh !important;
      border-radius: 16px !important;
    }

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

      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
        className="modifier-modal"
      >
        {/* Header */}
        <div style={styles.header} className="modifier-header">
          <div style={styles.headerLeft} className="modifier-header-left">
            {step > 1 && (
              <button style={styles.backButton} onClick={handlePrevious}>
                <ChevronLeft size={24} />
              </button>
            )}
            <div style={styles.title} className="modifier-title">
              {getStepTitle()}
            </div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={styles.content} className="hide-scrollbar modifier-content">
          <div style={styles.itemInfo} className="modifier-item-info">
            <div style={styles.itemName} className="modifier-item-name">
              {item.name}
            </div>
            <div style={styles.itemPrice} className="modifier-item-price">
              {SETTINGS.currency}
              {(getTotalPrice() / 100).toFixed(2)}
            </div>
          </div>

          {hasSizes && step === 1 && renderSizeSelection()}

          {isSub && step === 2 && renderModifierGroup(SUB_MODIFIERS.subToppings, true)}
          {isSub && step === 3 && renderModifierGroup(LIGHT_TOPPINGS_GROUP)}
          {isSub && step === 4 && renderModifierGroup(SUB_MODIFIERS.extras)}
          {isSub && step === 5 && renderConfirmation()}

          {isDrink && step === 2 && renderModifierGroup(DRINK_MODIFIERS.toppings)}
          {isDrink && step === 3 && renderConfirmation()}

          {isHot && step === 2 && renderConfirmation()}

          {!isSub &&
            !isDrink &&
            !isHot &&
            hasSizes &&
            step === 2 &&
            renderConfirmation()}
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