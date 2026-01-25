import { useEffect, useMemo, useState } from 'react';
import {
  X,
  Banknote,
  CreditCard,
  Gift,
  Printer,
  CheckCircle2,
  Percent,
  Tag,
  MinusCircle,
  Check,
  ShoppingCart,
  Square,
  CheckSquare,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePOS } from '../../hooks/usePOS';
import { SETTINGS } from '../../data/menuData';
import PrintReceipt from '../Common/PrintReceipt';

const PaymentModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  const {
    currentOrder,
    paymentMethod,
    setPaymentMethod,
    discount,
    setDiscount,
    completePayment,
    completePartialPayment,
  } = usePOS();

  const [activeTab, setActiveTab] = useState('payment');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Receipt
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransaction, setReceiptTransaction] = useState(null);
  const [autoPrint, setAutoPrint] = useState(false);

  // Discount UI state
  const [discountMode, setDiscountMode] = useState('percent');
  const [discountInput, setDiscountInput] = useState('');

  // ✅ Split by Item: selected item IDs
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());

  // ---------------------------
  // Totals
  // ---------------------------
  const baseSubtotal = useMemo(() => {
    return (currentOrder || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) / 100;
  }, [currentOrder]);

  const percentDiscountAmount = useMemo(() => {
    return (baseSubtotal * (discount || 0)) / 100;
  }, [baseSubtotal, discount]);

  const amountDiscountAmount = useMemo(() => {
    const v = parseFloat(discountInput);
    return Number.isFinite(v) ? Math.max(0, v) : 0;
  }, [discountInput]);

  const discountAmount = useMemo(() => {
    if (discountMode === 'amount') return Math.min(amountDiscountAmount, baseSubtotal);
    return Math.min(percentDiscountAmount, baseSubtotal);
  }, [discountMode, amountDiscountAmount, percentDiscountAmount, baseSubtotal]);

  const tax = useMemo(() => {
    const taxable = Math.max(0, baseSubtotal - discountAmount);
    return taxable * SETTINGS.taxRate;
  }, [baseSubtotal, discountAmount]);

  const total = useMemo(() => {
    return Math.max(0, baseSubtotal - discountAmount + tax);
  }, [baseSubtotal, discountAmount, tax]);

  // ✅ Split Totals (selected items only)
  const splitSubtotal = useMemo(() => {
    return (currentOrder || [])
      .filter((item) => selectedItemIds.has(item.orderId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0) / 100;
  }, [currentOrder, selectedItemIds]);

  const splitTax = useMemo(() => {
    return splitSubtotal * SETTINGS.taxRate;
  }, [splitSubtotal]);

  const splitTotal = useMemo(() => {
    return splitSubtotal + splitTax;
  }, [splitSubtotal, splitTax]);

  // ---------------------------
  // Payment helpers
  // ---------------------------
  const handleNumberPad = (value) => {
    if (value === 'clear') setEnteredAmount('');
    else if (value === 'backspace') setEnteredAmount((prev) => prev.slice(0, -1));
    else if (value === '.') setEnteredAmount((prev) => (prev.includes('.') ? prev : prev + '.'));
    else setEnteredAmount((prev) => prev + value);
  };

  const handleQuickAmount = (amount) => setEnteredAmount(String(amount));

  const calculateChange = () => {
    const received = parseFloat(enteredAmount) || 0;
    const due = activeTab === 'split' ? splitTotal : total;
    return received - due;
  };

  // Manual preview (does NOT complete payment)
  const buildPreviewTransaction = () => {
    const itemsForPreview = (currentOrder || []).map((it) => ({
      ...it,
      price: Number(it.price || 0) / 100,
      basePrice: Number(it.basePrice || 0) / 100,
      modifiersTotal: Number(it.modifiersTotal || 0) / 100,
      finalUnitPrice: Number(it.finalUnitPrice || 0) / 100,
    }));

    // Calculate totals for ALL items
    const previewSubtotal = itemsForPreview.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const previewTax = previewSubtotal * SETTINGS.taxRate;
    const previewDiscountAmount = (previewSubtotal * (discount || 0)) / 100;
    const previewTotal = previewSubtotal + previewTax - previewDiscountAmount;
    const previewTotalQty = itemsForPreview.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: `PREVIEW-${Date.now()}`,
      items: itemsForPreview,
      paymentMethod,
      discount,
      subtotal: previewSubtotal,
      tax: previewTax,
      discountAmount: previewDiscountAmount,
      total: previewTotal,
      totalQty: previewTotalQty,
      timestamp: Date.now(),
      timestampISO: new Date().toISOString(),
      status: 'preview',
      type: 'preview',
    };
  };

  const handlePrintPreview = () => {
    console.log('🔵 [MANUAL PRINT] Print button clicked');
    setError('');
    const tx = buildPreviewTransaction();
    console.log('📄 [MANUAL PRINT] Preview transaction created:', tx.id);
    setReceiptTransaction(tx);
    setAutoPrint(false); // Manual print, no auto-print
    console.log('👁️ [MANUAL PRINT] Showing receipt (auto-print: OFF)');
    setShowReceipt(true);
  };

  // Auto print after payment when receipt opens
  useEffect(() => {
    if (!showReceipt || !autoPrint) return;
    console.log('🖨️ [AUTO-PRINT] Receipt opened with auto-print enabled');
    console.log('⏰ [AUTO-PRINT] Triggering print dialog in 350ms...');
    const t = setTimeout(() => {
      console.log('🖨️ [AUTO-PRINT] Calling window.print() NOW');
      window.print();
      console.log('✅ [AUTO-PRINT] Print dialog should be visible');
    }, 350);
    return () => clearTimeout(t);
  }, [showReceipt, autoPrint]);

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setAutoPrint(false);
    setReceiptTransaction(null);
    
    // Close the entire payment modal after receipt is dismissed
    onClose();
  };

  const handleClose = () => {
    // Reset all state when closing
    setEnteredAmount('');
    setShowSuccess(false);
    setActiveTab('payment');
    setShowReceipt(false);
    setReceiptTransaction(null);
    setAutoPrint(false);
    setError('');
    setDiscountMode('percent');
    setDiscountInput('');
    setSelectedItemIds(new Set());
    
    onClose();
  };

  // ✅ Full Payment
  const handleCompletePayment = () => {
    console.log('🔵 [COMPLETE] Button clicked');
    setError('');

    let received = parseFloat(enteredAmount) || 0;

    if (paymentMethod === 'cash' && received === 0) {
      received = total;
      setEnteredAmount(total.toFixed(2));
    }

    if (paymentMethod === 'cash' && received < total) {
      setError('Insufficient amount. Enter cash received or tap Exact.');
      return;
    }

    console.log('💾 [COMPLETE] Saving transaction to storage...');
    const savedTx = completePayment();
    console.log('✅ [COMPLETE] Transaction saved:', savedTx.id);

    // Set receipt data for auto-print
    setReceiptTransaction(savedTx);
    setAutoPrint(true); // ← This triggers automatic printing
    console.log('🖨️ [COMPLETE] Auto-print enabled - receipt will show automatically');

    setShowSuccess(true);
    setTimeout(() => {
      console.log('✅ [COMPLETE] Success screen finished, showing receipt...');
      setShowSuccess(false);
      setShowReceipt(true); // ← Auto-show receipt after success
      setEnteredAmount('');
    }, 1200);
  };

  // ✅ Split Payment (partial)
  const handleCompleteSplitPayment = () => {
    console.log('🔵 [SPLIT] Button clicked');
    setError('');

    if (selectedItemIds.size === 0) {
      setError('Please select at least one item to pay for.');
      console.log('❌ [SPLIT] No items selected');
      return;
    }

    console.log('📦 [SPLIT] Selected items:', Array.from(selectedItemIds));

    let received = parseFloat(enteredAmount) || 0;

    if (paymentMethod === 'cash' && received === 0) {
      received = splitTotal;
      setEnteredAmount(splitTotal.toFixed(2));
    }

    if (paymentMethod === 'cash' && received < splitTotal) {
      setError('Insufficient amount. Enter cash received or tap Exact.');
      return;
    }

    console.log('💾 [SPLIT] Processing partial payment...');
    const savedTx = completePartialPayment(Array.from(selectedItemIds));

    if (!savedTx) {
      setError('Failed to complete split payment.');
      console.log('❌ [SPLIT] Payment failed');
      return;
    }

    console.log('✅ [SPLIT] Transaction saved:', savedTx.id);

    // Set receipt data for auto-print
    setReceiptTransaction(savedTx);
    setAutoPrint(true); // ← This triggers automatic printing
    console.log('🖨️ [SPLIT] Auto-print enabled - receipt will show automatically');

    setShowSuccess(true);
    setTimeout(() => {
      console.log('✅ [SPLIT] Success screen finished, showing receipt...');
      setShowSuccess(false);
      setShowReceipt(true); // ← Auto-show receipt after success
      setEnteredAmount('');
      setSelectedItemIds(new Set());
    }, 1200);
  };

  if (!isOpen) return null;

  // ---------------------------
  // Discount tab actions
  // ---------------------------
  const applyPercentDiscount = (pct) => {
    setDiscountMode('percent');
    setDiscountInput('');
    setDiscount(pct);
  };

  const applyAmountDiscount = () => {
    setDiscount(0);
  };

  const clearAllDiscounts = () => {
    setDiscount(0);
    setDiscountInput('');
    setDiscountMode('percent');
  };

  // ✅ Split by Item: Toggle selection
  const toggleItemSelection = (orderId) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const selectAllItems = () => {
    setSelectedItemIds(new Set(currentOrder.map((item) => item.orderId)));
  };

  const clearSelection = () => {
    setSelectedItemIds(new Set());
  };

  // ---------------------------
  // Styles
  // ---------------------------
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
      width: '820px',
      maxWidth: '100%',
      height: 'auto',
      maxHeight: 'calc(100vh - 40px)',
      overflow: 'hidden',
      boxShadow: theme.shadowLarge,
      display: 'flex',
      flexDirection: 'column',
    },

    header: {
      padding: '12px 16px',
      borderBottom: `2px solid ${theme.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
    },

    title: {
      fontSize: '16px',
      fontWeight: '800',
      color: theme.textPrimary,
    },

    closeButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: theme.textSecondary,
      padding: '4px',
    },

    tabs: {
      display: 'flex',
      borderBottom: `2px solid ${theme.border}`,
      background: theme.bgSecondary,
      flexShrink: 0,
    },

    tab: (isActive) => ({
      flex: 1,
      padding: '8px',
      border: 'none',
      background: isActive ? theme.cardBg : 'transparent',
      color: isActive ? theme.primary : theme.textSecondary,
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
      borderBottom: isActive ? `3px solid ${theme.primary}` : 'none',
      textTransform: 'uppercase',
    }),

    body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      minHeight: 0,
    },

    leftPanel: {
      flex: 1,
      minHeight: 0,
      padding: '12px',
      borderRight: `2px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },

    rightPanel: {
      width: '260px',
      minHeight: 0,
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },

    amountDisplay: {
      background: theme.bgSecondary,
      padding: '10px',
      borderRadius: '10px',
      border: `1px solid ${theme.border}`,
    },

    amountLabel: {
      fontSize: '12px',
      color: theme.textSecondary,
      marginBottom: '6px',
      fontWeight: '700',
    },

    amountValue: {
      fontSize: '22px',
      fontWeight: '900',
      color: theme.primary,
      letterSpacing: '0.2px',
    },

    paymentMethods: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '10px',
    },

    paymentMethodBtn: (isActive) => ({
      padding: '10px 8px',
      border: `2px solid ${isActive ? theme.primary : theme.border}`,
      borderRadius: '12px',
      background: isActive ? `${theme.primary}15` : theme.bgSecondary,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.15s ease',
    }),

    paymentMethodName: {
      fontSize: '11px',
      fontWeight: '800',
      color: theme.textPrimary,
    },

    quickAmounts: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
    },

    quickBtn: {
      padding: '12px',
      border: `2px solid ${theme.border}`,
      borderRadius: '12px',
      background: theme.bgSecondary,
      color: theme.textPrimary,
      fontSize: '14px',
      fontWeight: '900',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    },

    numberPad: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginTop: 'auto',
    },

    numberBtn: {
      padding: '12px',
      border: `1px solid ${theme.border}`,
      borderRadius: '14px',
      background: theme.bgSecondary,
      color: theme.textPrimary,
      fontSize: '18px',
      fontWeight: '900',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    },

    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0',
      fontSize: '13px',
    },

    summaryLabel: { color: theme.textSecondary, fontWeight: 700 },
    summaryValue: { fontWeight: 800, color: theme.textPrimary },

    divider: { height: '1px', background: theme.border, margin: '10px 0' },

    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      fontSize: '16px',
      fontWeight: '900',
    },

    changeRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      background: theme.success + '14',
      border: `1px solid ${theme.success}55`,
      borderRadius: '12px',
      marginTop: '10px',
    },

    changeLabel: { fontSize: '13px', fontWeight: '800', color: theme.textPrimary },
    changeValue: { fontSize: '15px', fontWeight: '900', color: theme.success },

    actionsRow: {
      display: 'flex',
      gap: '10px',
      marginTop: 'auto',
      paddingTop: '12px',
    },

    actionBtn: (variant) => {
      const isPrimary = variant === 'primary';
      return {
        flex: isPrimary ? 1.2 : 0.9,
        height: '44px',
        borderRadius: '12px',
        border: isPrimary ? 'none' : `2px solid ${theme.primary}`,
        background: isPrimary ? theme.success : theme.bgSecondary,
        color: isPrimary ? '#fff' : theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: '900',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isPrimary ? theme.shadowMedium : 'none',
      };
    },

    errorBox: {
      marginTop: '10px',
      padding: '10px',
      borderRadius: '12px',
      background: `${theme.danger}15`,
      border: `1px solid ${theme.danger}55`,
      color: theme.danger,
      fontSize: '12px',
      fontWeight: 800,
    },

    sectionTitle: {
      fontSize: '13px',
      fontWeight: 900,
      color: theme.textPrimary,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
    },

    discountModes: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
    },

    pill: (active) => ({
      flex: 1,
      padding: '10px',
      borderRadius: '12px',
      border: `2px solid ${active ? theme.primary : theme.border}`,
      background: active ? `${theme.primary}12` : theme.bgSecondary,
      color: active ? theme.primary : theme.textSecondary,
      fontWeight: 900,
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }),

    discountGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
    },

    discountBtn: (active) => ({
      padding: '12px',
      borderRadius: '12px',
      border: `2px solid ${active ? theme.primary : theme.border}`,
      background: active ? `${theme.primary}12` : theme.bgSecondary,
      color: active ? theme.primary : theme.textPrimary,
      fontWeight: 900,
      fontSize: '14px',
      cursor: 'pointer',
    }),

    inputWrap: {
      display: 'flex',
      gap: '10px',
      marginTop: '12px',
      alignItems: 'center',
    },

    input: {
      flex: 1,
      height: '44px',
      borderRadius: '12px',
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      color: theme.textPrimary,
      padding: '0 12px',
      fontWeight: 900,
      outline: 'none',
    },

    smallBtn: (variant) => ({
      height: '44px',
      padding: '0 12px',
      borderRadius: '12px',
      border: variant === 'danger' ? `1px solid ${theme.danger}55` : `1px solid ${theme.border}`,
      background: variant === 'danger' ? `${theme.danger}10` : theme.bgSecondary,
      color: variant === 'danger' ? theme.danger : theme.textPrimary,
      fontWeight: 900,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }),

    discountPreview: {
      marginTop: '12px',
      padding: '10px',
      borderRadius: '12px',
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 900,
      color: theme.textPrimary,
      fontSize: '13px',
    },

    successScreen: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
      textAlign: 'center',
    },

    successText: { fontSize: '22px', fontWeight: '900', color: theme.success },

    // ✅ Split by Item styles
    splitHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },

    splitActions: {
      display: 'flex',
      gap: '8px',
    },

    splitActionBtn: {
      padding: '6px 12px',
      borderRadius: '8px',
      border: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      color: theme.textPrimary,
      fontSize: '11px',
      fontWeight: '700',
      cursor: 'pointer',
    },

    itemsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '400px',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },

    splitItem: (isSelected) => ({
      padding: '12px',
      borderRadius: '10px',
      border: `2px solid ${isSelected ? theme.primary : theme.border}`,
      background: isSelected ? `${theme.primary}08` : theme.bgSecondary,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),

    splitItemTop: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '6px',
    },

    splitItemName: {
      flex: 1,
      fontSize: '14px',
      fontWeight: '700',
      color: theme.textPrimary,
    },

    splitItemPrice: {
      fontSize: '14px',
      fontWeight: '800',
      color: theme.primary,
    },

    splitItemDetails: {
      fontSize: '12px',
      color: theme.textSecondary,
      marginLeft: '30px',
    },

    splitSummary: {
      marginTop: '12px',
      padding: '12px',
      borderRadius: '10px',
      background: theme.bgSecondary,
      border: `2px solid ${theme.primary}`,
    },

    splitSummaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px',
      fontSize: '13px',
    },
  };

  // Receipt overlay
  if (showReceipt && receiptTransaction) {
    return (
      <div style={styles.overlay} onClick={handleCloseReceipt}>
        <div onClick={(e) => e.stopPropagation()}>
          <PrintReceipt transaction={receiptTransaction} onClose={handleCloseReceipt} />
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.successScreen}>
            <CheckCircle2 size={64} color={theme.success} style={{ marginBottom: 18 }} />
            <div style={styles.successText}>Payment Completed Successfully!</div>
          </div>
        </div>
      </div>
    );
  }

  const renderLeftContent = () => {
    if (activeTab === 'payment') {
      return (
        <>
          <div style={styles.amountDisplay}>
            <div style={styles.amountLabel}>Amount Due</div>
            <div style={styles.amountValue}>
              {SETTINGS.currency}{total.toFixed(2)}
            </div>
          </div>

          <div style={styles.amountDisplay}>
            <div style={styles.amountLabel}>Tendered</div>
            <div style={styles.amountValue}>
              {SETTINGS.currency}{enteredAmount || '0.00'}
            </div>
          </div>

          <div style={styles.quickAmounts}>
            <button style={styles.quickBtn} onClick={() => handleQuickAmount(5)}>
              {SETTINGS.currency}5
            </button>
            <button style={styles.quickBtn} onClick={() => handleQuickAmount(10)}>
              {SETTINGS.currency}10
            </button>
            <button style={styles.quickBtn} onClick={() => handleQuickAmount(20)}>
              {SETTINGS.currency}20
            </button>
            <button style={styles.quickBtn} onClick={() => handleQuickAmount(total.toFixed(2))}>
              Exact
            </button>
          </div>

          <div style={styles.numberPad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '×'].map((num) => (
              <button
                key={num}
                style={styles.numberBtn}
                onClick={() => handleNumberPad(num === '×' ? 'backspace' : num)}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (activeTab === 'discount') {
      const currentPct = discountMode === 'percent' ? (discount || 0) : 0;

      return (
        <>
          <div style={styles.sectionTitle}>
            <Tag size={18} />
            Discount
          </div>

          <div style={styles.discountModes}>
            <button
              style={styles.pill(discountMode === 'percent')}
              onClick={() => setDiscountMode('percent')}
            >
              <Percent size={16} />
              Percentage
            </button>
            <button
              style={styles.pill(discountMode === 'amount')}
              onClick={() => setDiscountMode('amount')}
            >
              <Tag size={16} />
              Fixed Amount
            </button>
          </div>

          {discountMode === 'percent' ? (
            <>
              <div style={styles.discountGrid}>
                {[0, 5, 10, 15, 20, 25, 30, 50].map((pct) => (
                  <button
                    key={pct}
                    style={styles.discountBtn(currentPct === pct)}
                    onClick={() => applyPercentDiscount(pct)}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <div style={styles.discountPreview}>
                <span>Discount</span>
                <span>-{SETTINGS.currency}{percentDiscountAmount.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <>
              <div style={styles.inputWrap}>
                <input
                  style={styles.input}
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder={`Enter discount amount (${SETTINGS.currency})`}
                  inputMode="decimal"
                />
                <button style={styles.smallBtn()} onClick={applyAmountDiscount}>
                  <Check size={18} />
                  Apply
                </button>
              </div>

              <div style={styles.discountPreview}>
                <span>Discount</span>
                <span>-{SETTINGS.currency}{discountAmount.toFixed(2)}</span>
              </div>
            </>
          )}

          <div style={{ marginTop: 12 }}>
            <button style={styles.smallBtn('danger')} onClick={clearAllDiscounts}>
              <MinusCircle size={18} />
              Remove Discount
            </button>
          </div>
        </>
      );
    }

    // ✅ Split by Item tab
    if (activeTab === 'split') {
      return (
        <>
          <div style={styles.splitHeader}>
            <div style={styles.sectionTitle}>
              <ShoppingCart size={18} />
              Select Items to Pay
            </div>

            <div style={styles.splitActions}>
              <button style={styles.splitActionBtn} onClick={selectAllItems}>
                Select All
              </button>
              <button style={styles.splitActionBtn} onClick={clearSelection}>
                Clear
              </button>
            </div>
          </div>

          <div style={styles.itemsList} className="payment-left-panel">
            {currentOrder.map((item) => {
              const isSelected = selectedItemIds.has(item.orderId);
              const unitPrice = (Number(item.price || 0) / 100).toFixed(2);
              const lineTotal = ((Number(item.price || 0) * item.quantity) / 100).toFixed(2);

              return (
                <div
                  key={item.orderId}
                  style={styles.splitItem(isSelected)}
                  onClick={() => toggleItemSelection(item.orderId)}
                >
                  <div style={styles.splitItemTop}>
                    {isSelected ? (
                      <CheckSquare size={20} color={theme.primary} />
                    ) : (
                      <Square size={20} color={theme.textSecondary} />
                    )}

                    <div style={styles.splitItemName}>
                      {item.name}
                      {item.size && ` (${item.size})`}
                    </div>

                    <div style={styles.splitItemPrice}>
                      {SETTINGS.currency}{lineTotal}
                    </div>
                  </div>

                  <div style={styles.splitItemDetails}>
                    {SETTINGS.currency}{unitPrice} × {item.quantity}
                    {item.modifiers?.length > 0 && (
                      <span> • {item.modifiers.reduce((sum, g) => sum + g.options.length, 0)} mods</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedItemIds.size > 0 && (
            <div style={styles.splitSummary}>
              <div style={styles.splitSummaryRow}>
                <span style={{ fontWeight: 700, color: theme.textSecondary }}>
                  Selected Items ({selectedItemIds.size})
                </span>
              </div>

              <div style={styles.splitSummaryRow}>
                <span style={{ color: theme.textSecondary }}>Subtotal</span>
                <span style={{ fontWeight: 800 }}>
                  {SETTINGS.currency}{splitSubtotal.toFixed(2)}
                </span>
              </div>

              <div style={styles.splitSummaryRow}>
                <span style={{ color: theme.textSecondary }}>
                  Tax ({(SETTINGS.taxRate * 100).toFixed(0)}%)
                </span>
                <span style={{ fontWeight: 800 }}>
                  {SETTINGS.currency}{splitTax.toFixed(2)}
                </span>
              </div>

              <div style={{ ...styles.splitSummaryRow, marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '15px', fontWeight: 900 }}>Total</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: theme.primary }}>
                  {SETTINGS.currency}{splitTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div style={styles.overlay} className="payment-overlay" onClick={handleClose}>
      <style>{`
        .payment-left-panel::-webkit-scrollbar,
        .payment-right-panel::-webkit-scrollbar {
          display: none;
        }
        @media (max-height: 720px) {
          .payment-overlay { padding: 10px !important; }
        }
      `}</style>

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>Complete Payment</div>
          <button style={styles.closeButton} onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.tabs}>
          <button style={styles.tab(activeTab === 'payment')} onClick={() => setActiveTab('payment')}>
            Payment
          </button>
          <button style={styles.tab(activeTab === 'discount')} onClick={() => setActiveTab('discount')}>
            Discount
          </button>
          <button style={styles.tab(activeTab === 'split')} onClick={() => setActiveTab('split')}>
            Split by Item
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.leftPanel} className="payment-left-panel">
            {renderLeftContent()}
          </div>

          <div style={styles.rightPanel} className="payment-right-panel">
            {/* Payment Methods */}
            <div style={styles.paymentMethods}>
              <button
                style={styles.paymentMethodBtn(paymentMethod === 'cash')}
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote size={20} color={paymentMethod === 'cash' ? theme.primary : theme.textSecondary} />
                <span style={styles.paymentMethodName}>Cash</span>
              </button>

              <button
                style={styles.paymentMethodBtn(paymentMethod === 'card')}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={20} color={paymentMethod === 'card' ? theme.primary : theme.textSecondary} />
                <span style={styles.paymentMethodName}>Card</span>
              </button>

              <button
                style={styles.paymentMethodBtn(paymentMethod === 'gift')}
                onClick={() => setPaymentMethod('gift')}
              >
                <Gift size={20} color={paymentMethod === 'gift' ? theme.primary : theme.textSecondary} />
                <span style={styles.paymentMethodName}>Gift</span>
              </button>
            </div>

            {/* Summary */}
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal</span>
              <span style={styles.summaryValue}>
                {SETTINGS.currency}{activeTab === 'split' ? splitSubtotal.toFixed(2) : baseSubtotal.toFixed(2)}
              </span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Tax ({(SETTINGS.taxRate * 100).toFixed(0)}%)</span>
              <span style={styles.summaryValue}>
                {SETTINGS.currency}{activeTab === 'split' ? splitTax.toFixed(2) : tax.toFixed(2)}
              </span>
            </div>

            {activeTab !== 'split' && discountAmount > 0 && (
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>
                  Discount {discountMode === 'percent' ? `(${discount || 0}%)` : ''}
                </span>
                <span style={styles.summaryValue}>
                  -{SETTINGS.currency}{discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div style={styles.divider} />

            <div style={styles.totalRow}>
              <span>Total</span>
              <span style={{ color: theme.primary }}>
                {SETTINGS.currency}{activeTab === 'split' ? splitTotal.toFixed(2) : total.toFixed(2)}
              </span>
            </div>

            {/* Change */}
            {paymentMethod === 'cash' && enteredAmount && (
              <div style={styles.changeRow}>
                <span style={styles.changeLabel}>Change</span>
                <span style={styles.changeValue}>
                  {SETTINGS.currency}{Math.max(0, calculateChange()).toFixed(2)}
                </span>
              </div>
            )}

            {/* Error */}
            {error && <div style={styles.errorBox}>{error}</div>}

            {/* Actions */}
            <div style={styles.actionsRow}>
              <button
                style={styles.actionBtn('outline')}
                onClick={handlePrintPreview}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              >
                <Printer size={18} />
                Print
              </button>

              <button
                style={styles.actionBtn('primary')}
                onClick={activeTab === 'split' ? handleCompleteSplitPayment : handleCompletePayment}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <CheckCircle2 size={18} />
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;