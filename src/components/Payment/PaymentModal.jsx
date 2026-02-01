// src/components/Payment/PaymentModal.jsx
import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { SETTINGS } from "../../data/menuData";
import PrintReceipt from "../Common/PrintReceipt";

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

  const [activeTab, setActiveTab] = useState("payment");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Receipt
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransaction, setReceiptTransaction] = useState(null);
  const [autoPrint, setAutoPrint] = useState(false);

  // Discount UI state
  const [discountMode, setDiscountMode] = useState("percent");
  const [discountInput, setDiscountInput] = useState("");

  // Split by Item: selected item IDs
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());

  /* ------------------ Responsive breakpoint helper ------------------ */
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isOpen && vw <= 1024) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen, vw]);

  const device = useMemo(() => {
    if (vw <= 480) return "xs"; // small mobile
    if (vw <= 768) return "sm"; // mobile
    if (vw <= 1024) return "md"; // tablet
    return "lg"; // desktop
  }, [vw]);

  const ui = useMemo(() => {
    // Desktop defaults
    let modalWidth = 820;
    let overlayPad = 20;

    let headerPad = "12px 16px";
    let bodyDir = "row";
    let leftPad = 12;
    let rightPad = 12;

    let rightWidth = 260;
    let leftMaxH = "unset";
    let rightMaxH = "unset";

    let amountFont = 22;
    let quickCols = 2;
    let numGap = 10;
    let numPad = 12;
    let numFont = 18;

    let discountCols = 4;
    let discountGap = 10;

    if (device === "md") {
      modalWidth = 750;
      bodyDir = "column";
      rightWidth = "100%";
      leftMaxH = "50vh";
      rightMaxH = "40vh";
      overlayPad = 16;
    }

    if (device === "sm") {
      modalWidth = "100%";
      bodyDir = "column";
      rightWidth = "100%";
      leftMaxH = "30vh";
      rightMaxH = "auto";
      overlayPad = 0;

      headerPad = "8px 12px";
      leftPad = 6;
      rightPad = 6;

      amountFont = 17;
      quickCols = 4;
      numGap = 3;
      numPad = 5;
      numFont = 13;

      discountCols = 4;
      discountGap = 5;
    }

    if (device === "xs") {
      modalWidth = "100%";
      bodyDir = "column";
      rightWidth = "100%";
      leftMaxH = "30vh";
      rightMaxH = "auto";
      overlayPad = 0;

      headerPad = "6px 10px";
      leftPad = 5;
      rightPad = 5;

      amountFont = 16;
      quickCols = 4;
      numGap = 2;
      numPad = 4;
      numFont = 12;

      discountCols = 4;
      discountGap = 4;
    }

    return {
      modalWidth,
      overlayPad,
      headerPad,
      bodyDir,
      leftPad,
      rightPad,
      rightWidth,
      leftMaxH,
      rightMaxH,
      amountFont,
      quickCols,
      numGap,
      numPad,
      numFont,
      discountCols,
      discountGap,
      isMobileSheet: device === "sm" || device === "xs",
      device,
    };
  }, [device]);

  /* ------------------ Totals ------------------ */
  /* ------------------ Totals (SAFE: cents integer math) ------------------ */

// subtotal in cents (your item.price already looks like cents)
const baseSubtotalCents = useMemo(() => {
  return (currentOrder || []).reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}, [currentOrder]);

// discount cents
const percentDiscountCents = useMemo(() => {
  // percent of subtotal, rounded to cents
  const pct = Number(discount || 0);
  return Math.round(baseSubtotalCents * (pct / 100));
}, [baseSubtotalCents, discount]);

const amountDiscountCents = useMemo(() => {
  // user enters dollars (e.g. 2.50) → convert to cents
  const v = parseFloat(discountInput);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.round((v + Number.EPSILON) * 100));
}, [discountInput]);

const discountCents = useMemo(() => {
  const raw =
    discountMode === "amount" ? amountDiscountCents : percentDiscountCents;
  return Math.min(raw, baseSubtotalCents); // cannot exceed subtotal
}, [discountMode, amountDiscountCents, percentDiscountCents, baseSubtotalCents]);

// tax cents (rounded)
const taxCents = useMemo(() => {
  const taxableCents = Math.max(0, baseSubtotalCents - discountCents);
  // taxable dollars = taxableCents / 100 → multiply taxRate → back to cents
  return Math.round((taxableCents * SETTINGS.taxRate) ); 
  // NOTE: because taxableCents already *100, taxRate produces cents directly
}, [baseSubtotalCents, discountCents]);

// total cents
const totalCents = useMemo(() => {
  return Math.max(0, baseSubtotalCents - discountCents + taxCents);
}, [baseSubtotalCents, discountCents, taxCents]);

// values in dollars for display
const baseSubtotal = useMemo(() => baseSubtotalCents / 100, [baseSubtotalCents]);
const discountAmount = useMemo(() => discountCents / 100, [discountCents]);
const tax = useMemo(() => taxCents / 100, [taxCents]);
const total = useMemo(() => totalCents / 100, [totalCents]);

  // Split Totals (selected items only)
  const splitSubtotalCents = useMemo(() => {
  return (currentOrder || [])
    .filter((item) => selectedItemIds.has(item.orderId))
    .reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
}, [currentOrder, selectedItemIds]);

const splitTaxCents = useMemo(() => {
  return Math.round(splitSubtotalCents * SETTINGS.taxRate);
}, [splitSubtotalCents]);

const splitTotalCents = useMemo(() => {
  return splitSubtotalCents + splitTaxCents;
}, [splitSubtotalCents, splitTaxCents]);

const splitSubtotal = useMemo(() => splitSubtotalCents / 100, [splitSubtotalCents]);
const splitTax = useMemo(() => splitTaxCents / 100, [splitTaxCents]);
const splitTotal = useMemo(() => splitTotalCents / 100, [splitTotalCents]);


  /* ------------------ Payment helpers ------------------ */
  const handleNumberPad = (value) => {
    if (value === "clear") setEnteredAmount("");
    else if (value === "backspace")
      setEnteredAmount((prev) => prev.slice(0, -1));
    else if (value === ".")
      setEnteredAmount((prev) => (prev.includes(".") ? prev : prev + "."));
    else setEnteredAmount((prev) => prev + value);
  };

  const handleQuickAmount = (amount) => setEnteredAmount(String(amount));

  const calculateChange = () => {
    const received = parseFloat(enteredAmount) || 0;
    const due = activeTab === "split" ? splitTotal : total;
    return received - due;
  };

  const buildPreviewTransaction = () => {
  // itemsForPreview prices are in dollars for PrintReceipt display
  const itemsForPreview = (currentOrder || []).map((it) => ({
    ...it,
    price: Number(it.price || 0) / 100, // dollars
    basePrice: Number(it.basePrice || 0) / 100,
    modifiersTotal: Number(it.modifiersTotal || 0) / 100,
    finalUnitPrice: Number(it.finalUnitPrice || 0) / 100,
  }));

  // ✅ subtotal in dollars (for readability)
  const previewSubtotal = itemsForPreview.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  // ✅ Convert to cents and do all math in cents
  const previewSubtotalCents = Math.round((previewSubtotal + Number.EPSILON) * 100);

  // percent discount (your discount state is percent)
  const previewDiscountCents = Math.round(
    previewSubtotalCents * ((Number(discount || 0) + Number.EPSILON) / 100)
  );

  const taxableCents = Math.max(0, previewSubtotalCents - previewDiscountCents);

  // taxableCents is already cents → multiply by taxRate → gives cents
  const previewTaxCents = Math.round(taxableCents * SETTINGS.taxRate);

  const previewTotalCents = taxableCents + previewTaxCents;

  // ✅ Convert back to dollars for receipt
  const previewSubtotalFixed = previewSubtotalCents / 100;
  const previewTaxFixed = previewTaxCents / 100;
  const previewDiscountFixed = previewDiscountCents / 100;
  const previewTotalFixed = previewTotalCents / 100;

  const previewTotalQty = itemsForPreview.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return {
    id: `PREVIEW-${Date.now()}`,
    date: new Date().toISOString(),
    type: "preview",
    items: itemsForPreview,

    // ✅ use these fixed values
    subtotal: previewSubtotalFixed,
    tax: previewTaxFixed,

    // IMPORTANT:
    // Your PrintReceipt reads either transaction.discountAmount OR computes from transaction.discount(%).
    // So store BOTH to be safe:
    discount: Number(discount || 0), // percent
    discountAmount: previewDiscountFixed, // dollars

    total: previewTotalFixed,
    totalQty: previewTotalQty,

    paymentMethod: "Preview",
    amountReceived: 0,
    change: 0,
  };
};


  const handlePrintPreview = () => {
    const preview = buildPreviewTransaction();
    setReceiptTransaction(preview);
    setAutoPrint(false);
    setShowReceipt(true);
  };

  useEffect(() => {
    if (!showReceipt || !autoPrint) return;
    const t = setTimeout(() => {
      // window.print();
    }, 350);
    return () => clearTimeout(t);
  }, [showReceipt, autoPrint]);

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setAutoPrint(false);
    setReceiptTransaction(null);
    onClose();
  };

  const handleClose = () => {
    setEnteredAmount("");
    setShowSuccess(false);
    setActiveTab("payment");
    setShowReceipt(false);
    setReceiptTransaction(null);
    setAutoPrint(false);
    setError("");
    setDiscountMode("percent");
    setDiscountInput("");
    setSelectedItemIds(new Set());
    onClose();
  };

  const handleCompletePayment = () => {
    setError("");

    let received = parseFloat(enteredAmount) || 0;

    if (paymentMethod === "cash" && received === 0) {
      received = total;
      setEnteredAmount(total.toFixed(2));
    }

    if (paymentMethod === "cash" && received < total) {
      setError("Insufficient amount. Enter cash received or tap Exact.");
      return;
    }

    const savedTx = completePayment();
    setReceiptTransaction(savedTx);
    setAutoPrint(true);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowReceipt(true);
      setEnteredAmount("");
    }, 1200);
  };

  const handleCompleteSplitPayment = () => {
    setError("");

    if (selectedItemIds.size === 0) {
      setError("Please select at least one item to pay for.");
      return;
    }

    let received = parseFloat(enteredAmount) || 0;

    if (paymentMethod === "cash" && received === 0) {
      received = splitTotal;
      setEnteredAmount(splitTotal.toFixed(2));
    }

    if (paymentMethod === "cash" && received < splitTotal) {
      setError("Insufficient amount. Enter cash received or tap Exact.");
      return;
    }

    const savedTx = completePartialPayment(Array.from(selectedItemIds));

    if (!savedTx) {
      setError("Failed to complete split payment.");
      return;
    }

    setReceiptTransaction(savedTx);
    setAutoPrint(true);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowReceipt(true);
      setEnteredAmount("");
      setSelectedItemIds(new Set());
    }, 1200);
  };

  if (!isOpen) return null;

  const applyPercentDiscount = (pct) => {
    setDiscountMode("percent");
    setDiscountInput("");
    setDiscount(pct);
  };

  const applyAmountDiscount = () => {
    setDiscount(0);
  };

  const clearAllDiscounts = () => {
    setDiscount(0);
    setDiscountInput("");
    setDiscountMode("percent");
  };

  const toggleItemSelection = (orderId) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const selectAllItems = () => {
    setSelectedItemIds(new Set(currentOrder.map((item) => item.orderId)));
  };

  const clearSelection = () => {
    setSelectedItemIds(new Set());
  };

  /* ------------------ Styles (responsive values injected) ------------------ */
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: ui.isMobileSheet ? "flex-start" : "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: 0,
      overflow: "hidden",
    },

    modal: {
      background: theme.cardBg,
      borderRadius: ui.isMobileSheet ? "0px" : "16px",
      width:
        typeof ui.modalWidth === "number" ? `${ui.modalWidth}px` : ui.modalWidth,
      maxWidth: "100%",
      height: ui.isMobileSheet ? "100vh" : "auto",
      maxHeight: ui.isMobileSheet ? "100vh" : "calc(100vh - 40px)",
      overflow: "hidden",
      boxShadow: theme.shadowLarge,
      display: "flex",
      flexDirection: "column",
      marginTop: 0,
    },

    header: {
      padding: ui.headerPad,
      borderBottom: `2px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
    },

    title: {
      fontSize: ui.device === "xs" ? "15px" : "16px",
      fontWeight: "900",
      color: theme.textPrimary,
    },

    closeButton: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: theme.textSecondary,
      padding: "4px",
    },

    tabs: {
      display: "flex",
      borderBottom: `2px solid ${theme.border}`,
      background: theme.bgSecondary,
      flexShrink: 0,
    },

    tab: (isActive) => ({
      flex: 1,
      padding: ui.device === "xs" ? "6px" : "8px",
      border: "none",
      background: isActive ? theme.cardBg : "transparent",
      color: isActive ? theme.primary : theme.textSecondary,
      fontSize: ui.device === "xs" ? "11px" : "13px",
      fontWeight: "800",
      cursor: "pointer",
      borderBottom: isActive ? `3px solid ${theme.primary}` : "none",
      textTransform: "uppercase",
    }),

    body: {
      display: "flex",
      flex: 1,
      overflow: "hidden",
      minHeight: 0,
      height: "100%",
      flexDirection: ui.bodyDir,
    },

    leftPanel: {
  // ✅ only grow on desktop row layout
  flex: ui.bodyDir === "row" ? 1 : "unset",
  flexGrow: ui.bodyDir === "row" ? 1 : 0,

  minHeight: 0,
  padding: `${ui.leftPad}px`,
  borderRight: ui.bodyDir === "row" ? `2px solid ${theme.border}` : "none",
  borderBottom: ui.bodyDir === "column" ? `2px solid ${theme.border}` : "none",

  display: "flex",
  flexDirection: "column",
  gap: ui.isMobileSheet ? "2px" : "8px",

  overflowY: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",

  // keep your limit
  maxHeight: ui.leftMaxH,
},


    rightPanel: {
      width:
        typeof ui.rightWidth === "number" ? `${ui.rightWidth}px` : ui.rightWidth,
      minHeight: 0,
      padding: `${ui.rightPad}px`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      background: theme.cardBg,
      flexShrink: 0,
    },

    rightScroll: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      paddingBottom: ui.isMobileSheet ? "4px" : "0px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      maxHeight: ui.isMobileSheet ? "auto" : "none",
    },

    actionsBar: {
  position: "static",
  bottom: 0,
  background: theme.cardBg,

  // 🔧 TIGHTEN
  paddingTop: ui.isMobileSheet ? "6px" : "12px",
  marginTop: ui.isMobileSheet ? "6px" : "12px",

  borderTop: `2px solid ${theme.border}`,
  flexShrink: 0,
},


    amountDisplay: {
      background: theme.bgSecondary,
      padding: ui.isMobileSheet ? "16px 18px" : "20px",
      borderRadius: "10px",
      border: `1px solid ${theme.border}`,
    },

    amountLabel: {
      fontSize: ui.device === "xs" ? "10px" : "12px",
      color: theme.textSecondary,
      marginBottom: ui.isMobileSheet ? "2px" : "6px",
      fontWeight: "800",
    },

    amountValue: {
      fontSize: `${ui.amountFont}px`,
      fontWeight: "900",
      color: theme.primary,
      letterSpacing: "0.2px",
    },

    paymentMethods: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: ui.isMobileSheet ? "4px" : "8px",
      marginBottom: ui.isMobileSheet ? "4px" : "10px",
    },

    paymentMethodBtn: (isActive) => ({
      padding: ui.isMobileSheet ? "6px 5px" : "10px 8px",
      border: `2px solid ${isActive ? theme.primary : theme.border}`,
      borderRadius: "10px",
      background: isActive ? `${theme.primary}15` : theme.bgSecondary,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
      transition: "all 0.15s ease",
    }),

    paymentMethodName: {
      fontSize: ui.device === "xs" ? "10px" : "11px",
      fontWeight: "900",
      color: theme.textPrimary,
    },

    quickAmounts: {
  display: "grid",
  gridTemplateColumns: `repeat(${ui.quickCols}, 1fr)`,
  gap: ui.isMobileSheet ? "3px" : "10px",
},

    quickBtn: {
      padding: ui.device === "xs" ? "4px" : ui.device === "sm" ? "5px" : "12px",
      border: `2px solid ${theme.border}`,
      borderRadius: "10px",
      background: theme.bgSecondary,
      color: theme.textPrimary,
      fontSize: ui.device === "xs" ? "11px" : ui.device === "sm" ? "12px" : "14px",
      fontWeight: "900",
      cursor: "pointer",
      transition: "all 0.15s ease",
    },

    numberPad: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: `${ui.numGap}px`,

  // 🔧 CHANGE THIS
  marginTop: ui.isMobileSheet ? "6px" : "auto",
  marginBottom: ui.isMobileSheet ? "6px" : "0px",
},


    numBtn: {
      padding: `${ui.numPad}px`,
      border: `2px solid ${theme.border}`,
      borderRadius: "10px",
      background: theme.bgSecondary,
      color: theme.textPrimary,
      fontSize: `${ui.numFont}px`,
      fontWeight: "900",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: ui.device === "xs" ? "30px" : ui.device === "sm" ? "32px" : "48px",
      transition: "all 0.15s ease",
    },

    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: ui.isMobileSheet ? "3px" : "6px",
      alignItems: "center",
    },

    summaryLabel: {
      fontSize: "13px",
      color: theme.textSecondary,
      fontWeight: "800",
    },

    summaryValue: {
      fontSize: "13px",
      fontWeight: "900",
      color: theme.textPrimary,
    },

    divider: {
      height: "2px",
      background: theme.border,
      margin: ui.isMobileSheet ? "6px 0" : "8px 0",
    },

    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "16px",
      fontWeight: "900",
      color: theme.textPrimary,
      marginBottom: ui.isMobileSheet ? "4px" : "6px",
    },

    changeRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: ui.isMobileSheet ? "6px" : "8px",
      background: theme.bgSecondary,
      borderRadius: "8px",
      marginTop: ui.isMobileSheet ? "4px" : "6px",
    },

    changeLabel: {
      fontSize: "13px",
      fontWeight: "800",
      color: theme.textSecondary,
    },

    changeValue: {
      fontSize: "14px",
      fontWeight: "900",
      color: theme.success,
    },

    actionsRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
    },

    actionBtn: (variant) => ({
  padding: ui.isMobileSheet ? "10px 12px" : "12px 16px",

  // Border logic
  border:
    variant === "outline"
      ? `2px solid ${theme.border}`      // Outline button (Print)
      : "2px solid transparent",         // Primary button (Complete) → NO BORDER

  borderRadius: "10px",

  // Background
  background:
    variant === "outline"
      ? "transparent"
      : theme.success,                   // Green Complete button

  color:
    variant === "outline"
      ? theme.textPrimary
      : "#FFFFFF",

  fontSize: ui.device === "xs" ? "13px" : "14px",
  fontWeight: "900",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",

  transition: "all 0.15s ease",

  // 🔥 Kill browser focus / active outline
  outline: "none",
  boxShadow: "none",
}),



    errorBox: {
      background: `${theme.danger}15`,
      border: `2px solid ${theme.danger}`,
      borderRadius: "10px",
      padding: "10px",
      fontSize: "13px",
      fontWeight: "800",
      color: theme.danger,
      marginTop: "8px",
    },

    successScreen: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  minHeight: ui.isMobileSheet ? "140px" : "200px",
  padding: ui.isMobileSheet ? "20px" : "40px",
},

successText: {
  fontSize: ui.device === "xs"
    ? "14px"
    : ui.device === "sm"
    ? "15px"
    : "18px",   // desktop stays big

  fontWeight: "900",
  color: theme.success,
  textAlign: "center",
},


    discountButtons: {
      display: "grid",
      gridTemplateColumns: `repeat(${ui.discountCols}, 1fr)`,
      gap: `${ui.discountGap}px`,
    },

    discountBtn: (isActive) => ({
      padding: ui.device === "xs" ? "10px" : "12px",
      border: `2px solid ${isActive ? theme.primary : theme.border}`,
      borderRadius: "12px",
      background: isActive ? `${theme.primary}15` : theme.bgSecondary,
      color: isActive ? theme.primary : theme.textPrimary,
      fontSize: ui.device === "xs" ? "13px" : "14px",
      fontWeight: "900",
      cursor: "pointer",
      transition: "all 0.15s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    }),

    discountInput: {
      width: "100%",
      padding: "12px",
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      background: theme.bgSecondary,
      color: theme.textPrimary,
      fontSize: "14px",
      fontWeight: "800",
      outline: "none",
    },

    splitItem: (isSelected) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "10px",
      border: `2px solid ${isSelected ? theme.primary : theme.border}`,
      borderRadius: "12px",
      background: isSelected ? `${theme.primary}10` : theme.bgSecondary,
      cursor: "pointer",
      transition: "all 0.15s ease",
    }),

    splitItemCheckbox: (isSelected) => ({
      width: "20px",
      height: "20px",
      borderRadius: "6px",
      border: `2px solid ${isSelected ? theme.primary : theme.border}`,
      background: isSelected ? theme.primary : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }),

    splitItemDetails: {
      flex: 1,
      minWidth: 0,
    },

    splitItemName: {
      fontSize: "13px",
      fontWeight: "900",
      color: theme.textPrimary,
      marginBottom: "2px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    splitItemMeta: {
      fontSize: "11px",
      color: theme.textSecondary,
      fontWeight: "800",
    },

    splitItemPrice: {
      fontSize: "14px",
      fontWeight: "900",
      color: theme.textPrimary,
      flexShrink: 0,
    },

    splitSelectionBar: {
      display: "flex",
      gap: "8px",
      marginBottom: "8px",
    },

    splitSelectionBtn: {
      flex: 1,
      padding: "8px",
      border: `2px solid ${theme.border}`,
      borderRadius: "10px",
      background: theme.bgSecondary,
      color: theme.textPrimary,
      fontSize: "12px",
      fontWeight: "900",
      cursor: "pointer",
      transition: "all 0.15s ease",
    },

    splitSummaryCard: {
      background: theme.bgSecondary,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "10px",
      marginTop: "10px",
    },

    splitSummaryRow: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "13px",
      marginBottom: "4px",
      fontWeight: "800",
    },

    splitItemsList: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "10px",
      overflowY: "auto",
      maxHeight: ui.isMobileSheet ? "25vh" : "300px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
  };

  /* ------------------ Render Left Content by Tab ------------------ */
  const renderLeftContent = () => {
    if (activeTab === "payment") {
      return (
        <>
          <div style={styles.amountDisplay}>
            <div style={styles.amountLabel}>
              {paymentMethod === "cash" ? "Cash Received" : "Amount"}
            </div>
            <div style={styles.amountValue}>
              {SETTINGS.currency}
              {enteredAmount || "0.00"}
            </div>
          </div>

          <div style={styles.quickAmounts}>
            <button
              style={styles.quickBtn}
              onClick={() => handleQuickAmount(10)}
            >
              CA$10
            </button>
            <button
              style={styles.quickBtn}
              onClick={() => handleQuickAmount(20)}
            >
              CA$20
            </button>
            <button
              style={styles.quickBtn}
              onClick={() =>
                handleQuickAmount((activeTab === "split" ? splitTotal : total).toFixed(2))
              }
            >
              Exact
            </button>
            <button
              style={styles.quickBtn}
              onClick={() => handleQuickAmount(50)}
            >
              CA$50
            </button>
          </div>

          <div style={styles.numberPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "←"].map((val, idx) => (
              <button
                key={idx}
                style={styles.numBtn}
                onClick={() => {
                  if (val === "←") handleNumberPad("backspace");
                  else handleNumberPad(String(val));
                }}
              >
                {val === "←" ? "←" : val}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (activeTab === "discount") {
      return (
        <>
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "800",
                color: theme.textSecondary,
                marginBottom: "8px",
              }}
            >
              Percentage Discounts
            </div>
            <div style={styles.discountButtons}>
              <button
                style={styles.discountBtn(discountMode === "percent" && discount === 10)}
                onClick={() => applyPercentDiscount(10)}
              >
                <Percent size={14} />
                10%
              </button>
              <button
                style={styles.discountBtn(discountMode === "percent" && discount === 20)}
                onClick={() => applyPercentDiscount(20)}
              >
                <Percent size={14} />
                20%
              </button>
              <button
                style={styles.discountBtn(discountMode === "percent" && discount === 30)}
                onClick={() => applyPercentDiscount(30)}
              >
                <Percent size={14} />
                30%
              </button>
              <button
                style={styles.discountBtn(discountMode === "percent" && discount === 50)}
                onClick={() => applyPercentDiscount(50)}
              >
                <Percent size={14} />
                50%
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "800",
                color: theme.textSecondary,
                marginBottom: "8px",
              }}
            >
              Fixed Amount Discount
            </div>
            <input
              type="number"
              placeholder="Enter amount"
              value={discountInput}
              onChange={(e) => {
                setDiscountInput(e.target.value);
                if (e.target.value) {
                  setDiscountMode("amount");
                  applyAmountDiscount();
                }
              }}
              style={styles.discountInput}
            />
          </div>

          <button
            style={{
              ...styles.discountBtn(false),
              background: theme.danger,
              color: "#FFFFFF",
              border: `2px solid ${theme.danger}`,
            }}
            onClick={clearAllDiscounts}
          >
            <MinusCircle size={16} />
            Clear All
          </button>

          {discountAmount > 0 && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                background: `${theme.success}15`,
                border: `2px solid ${theme.success}`,
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "900",
                color: theme.success,
                textAlign: "center",
              }}
            >
              Discount Applied: {SETTINGS.currency}
              {discountAmount.toFixed(2)}
            </div>
          )}
        </>
      );
    }

    if (activeTab === "split") {
      return (
        <>
          <div style={styles.splitSelectionBar}>
            <button style={styles.splitSelectionBtn} onClick={selectAllItems}>
              Select All
            </button>
            <button style={styles.splitSelectionBtn} onClick={clearSelection}>
              Clear All
            </button>
          </div>

          <div style={styles.splitItemsList}>
            {(currentOrder || []).map((item) => {
              const isSelected = selectedItemIds.has(item.orderId);
              return (
                <div
                  key={item.orderId}
                  style={styles.splitItem(isSelected)}
                  onClick={() => toggleItemSelection(item.orderId)}
                >
                  <div style={styles.splitItemCheckbox(isSelected)}>
                    {isSelected && <Check size={14} color="#FFFFFF" />}
                  </div>

                  <div style={styles.splitItemDetails}>
                    <div style={styles.splitItemName}>{item.name}</div>
                    <div style={styles.splitItemMeta}>Qty: {item.quantity}</div>
                  </div>

                  <div style={styles.splitItemPrice}>
                    {SETTINGS.currency}
                    {((item.price * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedItemIds.size > 0 && (
            <div style={styles.splitSummaryCard}>
              <div
                style={{
                  ...styles.splitSummaryRow,
                  marginBottom: "8px",
                  paddingBottom: "6px",
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <span style={{ fontWeight: 900, color: theme.primary }}>
                  Selected Items ({selectedItemIds.size})
                </span>
              </div>

              <div style={styles.splitSummaryRow}>
                <span style={{ color: theme.textSecondary }}>Subtotal</span>
                <span style={{ fontWeight: 900 }}>
                  {SETTINGS.currency}
                  {splitSubtotal.toFixed(2)}
                </span>
              </div>

              <div style={styles.splitSummaryRow}>
                <span style={{ color: theme.textSecondary }}>
                  Tax ({(SETTINGS.taxRate * 100).toFixed(0)}%)
                </span>
                <span style={{ fontWeight: 900 }}>
                  {SETTINGS.currency}
                  {splitTax.toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  ...styles.splitSummaryRow,
                  marginTop: "6px",
                  paddingTop: "6px",
                  borderTop: `1px solid ${theme.border}`,
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 900 }}>Total</span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    color: theme.primary,
                  }}
                >
                  {SETTINGS.currency}
                  {splitTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </>
      );
    }

    return null;
  };

  /* ------------------ Receipts / Success screens ------------------ */
  if (showReceipt && receiptTransaction) {
    return (
      <div style={styles.overlay} onClick={handleCloseReceipt}>
        <div onClick={(e) => e.stopPropagation()}>
          <PrintReceipt
            transaction={receiptTransaction}
            onClose={handleCloseReceipt}
          />
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.successScreen}>
            <CheckCircle2
              size={64}
              color={theme.success}
              style={{ marginBottom: 18 }}
            />
            <div style={styles.successText}>Payment Completed Successfully!</div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------ Main UI ------------------ */
  return (
    <div style={styles.overlay} onClick={handleClose}>
      <style>{`
        /* Hide scrollbars (keep scrolling) */
        .pm-hide-scroll::-webkit-scrollbar { display: none; }
        
        /* Prevent body scroll on mobile */
        @media (max-width: 1024px) {
          body.modal-open {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
          }
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
          <button
            style={styles.tab(activeTab === "payment")}
            onClick={() => setActiveTab("payment")}
          >
            Payment
          </button>
          <button
            style={styles.tab(activeTab === "discount")}
            onClick={() => setActiveTab("discount")}
          >
            Discount
          </button>
          <button
            style={styles.tab(activeTab === "split")}
            onClick={() => setActiveTab("split")}
          >
            Split by Item
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.leftPanel} className="pm-hide-scroll">
            {renderLeftContent()}
          </div>

          <div style={styles.rightPanel}>
            <div style={styles.rightScroll} className="pm-hide-scroll">
              <div style={styles.paymentMethods}>
                <button
                  style={styles.paymentMethodBtn(paymentMethod === "cash")}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote
                    size={20}
                    color={
                      paymentMethod === "cash"
                        ? theme.primary
                        : theme.textSecondary
                    }
                  />
                  <span style={styles.paymentMethodName}>Cash</span>
                </button>

                <button
                  style={styles.paymentMethodBtn(paymentMethod === "card")}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard
                    size={20}
                    color={
                      paymentMethod === "card"
                        ? theme.primary
                        : theme.textSecondary
                    }
                  />
                  <span style={styles.paymentMethodName}>Card</span>
                </button>

                <button
                  style={styles.paymentMethodBtn(paymentMethod === "gift")}
                  onClick={() => setPaymentMethod("gift")}
                >
                  <Gift
                    size={20}
                    color={
                      paymentMethod === "gift"
                        ? theme.primary
                        : theme.textSecondary
                    }
                  />
                  <span style={styles.paymentMethodName}>Gift</span>
                </button>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>
                  {SETTINGS.currency}
                  {activeTab === "split"
                    ? splitSubtotal.toFixed(2)
                    : baseSubtotal.toFixed(2)}
                </span>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>
                  Tax ({(SETTINGS.taxRate * 100).toFixed(0)}%)
                </span>
                <span style={styles.summaryValue}>
                  {SETTINGS.currency}
                  {activeTab === "split" ? splitTax.toFixed(2) : tax.toFixed(2)}
                </span>
              </div>

              {activeTab !== "split" && discountAmount > 0 && (
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Discount{" "}
                    {discountMode === "percent" ? `(${discount || 0}%)` : ""}
                  </span>
                  <span style={styles.summaryValue}>
                    -{SETTINGS.currency}
                    {discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div style={styles.divider} />

              <div style={styles.totalRow}>
                <span>Total</span>
                <span style={{ color: theme.primary }}>
                  {SETTINGS.currency}
                  {activeTab === "split"
                    ? splitTotal.toFixed(2)
                    : total.toFixed(2)}
                </span>
              </div>

              {paymentMethod === "cash" && enteredAmount && (
                <div style={styles.changeRow}>
                  <span style={styles.changeLabel}>Change</span>
                  <span style={styles.changeValue}>
                    {SETTINGS.currency}
                    {Math.max(0, calculateChange()).toFixed(2)}
                  </span>
                </div>
              )}

              {error && <div style={styles.errorBox}>{error}</div>}
            </div>

            <div style={styles.actionsBar}>
              <div style={styles.actionsRow}>
                <button style={styles.actionBtn("outline")} onClick={handlePrintPreview}>
                  <Printer size={18} />
                  Print
                </button>

                <button
                  style={styles.actionBtn("primary")}
                  onClick={
                    activeTab === "split"
                      ? handleCompleteSplitPayment
                      : handleCompletePayment
                  }
                >
                  <CheckCircle2 size={18} />
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;