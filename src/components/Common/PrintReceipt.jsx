import { Printer } from "lucide-react";
import { SETTINGS } from "../../data/menuData";
import { formatDateTime } from "../../utils/dateUtils";
import { useRef } from "react";

const PrintReceipt = ({ transaction, onClose }) => {
  const printFrameRef = useRef(null);

  if (!transaction) return null;

  const items = transaction.items || [];

  const subtotal =
    typeof transaction.subtotal === "number"
      ? transaction.subtotal
      : items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
          0
        );

  const tax =
    typeof transaction.tax === "number"
      ? transaction.tax
      : subtotal * SETTINGS.taxRate;

  const discountAmount =
    typeof transaction.discountAmount === "number"
      ? transaction.discountAmount
      : (subtotal * (transaction.discount || 0)) / 100;

  const total =
    typeof transaction.total === "number"
      ? transaction.total
      : subtotal + tax - discountAmount;

  const totalQty =
    typeof transaction.totalQty === "number"
      ? transaction.totalQty
      : items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const receiptDate = transaction.timestampISO
    ? formatDateTime(new Date(transaction.timestampISO))
    : transaction.timestamp
    ? formatDateTime(new Date(transaction.timestamp))
    : formatDateTime(new Date());

  const getTransactionTypeBadge = () => {
    if (transaction.type === "split") return "SPLIT PAYMENT";
    if (transaction.type === "preview") return "PREVIEW";
    return "FULL PAYMENT";
  };

  const normalizeMoney = (value) => {
    const n = Number(value || 0);
    if (!Number.isFinite(n)) return 0;
    if (Number.isInteger(n) && n >= 1) return n / 100;
    return n;
  };

  const getItemModifiers = (item) => {
    const modLines = [];
    if (item.size) modLines.push(`- Size: ${item.size}`);

    if (item.modifiers && item.modifiers.length > 0) {
      item.modifiers.forEach((group) => {
        if (group.options && group.options.length > 0) {
          group.options.forEach((option) => {
            const raw = option?.price ?? 0;
            const p = normalizeMoney(raw);
            const priceStr = p > 0 ? ` +${SETTINGS.currency}${p.toFixed(2)}` : "";
            modLines.push(`- ${option.name}${priceStr}`);
          });
        }
      });
    }
    return modLines;
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const handlePrint = () => {
    // Generate receipt HTML
    const receiptHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${escapeHtml(transaction.id || 'N/A')}</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      line-height: 1.4;
      color: #000000;
      background: #ffffff;
      width: 80mm;
      padding: 10mm;
    }
    
    .receipt-container {
      width: 100%;
    }
    
    .header {
      text-align: center;
      padding-bottom: 8px;
      border-bottom: 1px dashed #000000;
      margin-bottom: 8px;
    }
    
    .shop-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 2px;
    }
    
    .shop-sub {
      font-size: 11px;
      font-weight: 600;
    }
    
    .type-badge {
      display: inline-block;
      padding: 3px 6px;
      margin: 6px 0 2px;
      border-radius: 3px;
      background: #000000;
      color: #ffffff;
      font-size: 9px;
      font-weight: bold;
    }
    
    .order-block {
      font-size: 11px;
      margin: 6px 0;
    }
    
    .row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    
    .divider {
      border-top: 1px dashed #000000;
      margin: 6px 0;
    }
    
    .table-head {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 4px;
      font-weight: bold;
      margin-bottom: 4px;
      font-size: 11px;
    }
    
    .th-product { text-align: left; }
    .th-price { text-align: center; }
    .th-qty { text-align: center; }
    .th-total { text-align: right; }
    
    .table-row {
      margin: 6px 0;
    }
    
    .product-line {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 4px;
      font-size: 11px;
    }
    
    .product-name {
      font-weight: bold;
      word-break: break-word;
    }
    
    .cell-price { text-align: center; }
    .cell-qty { text-align: center; }
    .cell-total { 
      text-align: right;
      font-weight: bold;
    }
    
    .product-subline {
      font-size: 10px;
      margin-left: 4px;
      margin-top: 2px;
      color: #444444;
    }
    
    .qty-line {
      text-align: right;
      font-weight: bold;
      margin-top: 4px;
    }
    
    .totals {
      margin-top: 6px;
      border-top: 1px dashed #000000;
      padding-top: 6px;
    }
    
    .total-line {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
      font-size: 12px;
    }
    
    .amount-due {
      margin-top: 8px;
      border-top: 2px solid #000000;
      border-bottom: 2px solid #000000;
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }
    
    .amount-due .label { font-size: 14px; }
    .amount-due .value { font-size: 24px; }
    
    .tax-table-head, .tax-table-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
      font-size: 11px;
    }
    
    .tax-table-head {
      margin-top: 10px;
      border-top: 1px dashed #000000;
      padding-top: 6px;
      font-weight: bold;
    }
    
    .tax-table-row {
      margin-top: 3px;
      font-weight: bold;
    }
    
    .footer {
      margin-top: 10px;
      border-top: 1px dashed #000000;
      padding-top: 8px;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
    }
    
    @media print {
      body {
        width: 80mm;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="shop-name">${escapeHtml(SETTINGS.shopName)}</div>
      <div class="shop-sub">${escapeHtml(SETTINGS.shopSubtitle || "")}</div>
      <div class="type-badge">${escapeHtml(getTransactionTypeBadge())}</div>
    </div>

    <div class="order-block">
      <div class="row">
        <span><b>Order Details (Exc Tax)</b></span>
        <span><b>${escapeHtml(receiptDate)}</b></span>
      </div>
      <div class="row">
        <span>Order No</span>
        <span>${escapeHtml(String(transaction.orderNumber ?? "N/A"))}</span>
      </div>
      <div class="row">
        <span>Order ID</span>
        <span>${escapeHtml(transaction.id || "N/A")}</span>
      </div>
      <div class="row">
        <span>Payment Method</span>
        <span style="text-transform: capitalize;">${escapeHtml(transaction.paymentMethod || "Cash")}</span>
      </div>
      <div class="row">
        <span>Staff</span>
        <span>Manager</span>
      </div>
      <div class="row">
        <span>Device</span>
        <span>Till2</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="table-head">
      <div class="th-product">PRODUCT</div>
      <div class="th-price">PRICE</div>
      <div class="th-qty">QTY</div>
      <div class="th-total">TOTAL</div>
    </div>

    ${items.map((item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      const lineTotal = price * qty;
      const modLines = getItemModifiers(item);

      return `
        <div class="table-row">
          <div class="product-line">
            <div class="product-name">${escapeHtml(item.name)}</div>
            <div class="cell-price">${SETTINGS.currency}${price.toFixed(2)}</div>
            <div class="cell-qty">${qty}</div>
            <div class="cell-total">${SETTINGS.currency}${lineTotal.toFixed(2)}</div>
          </div>
          ${modLines.map(modLine => `<div class="product-subline">${escapeHtml(modLine)}</div>`).join('')}
        </div>
      `;
    }).join('')}

    <div class="qty-line">Total Qty ${totalQty}</div>

    <div class="divider"></div>

    <div class="totals">
      <div class="total-line">
        <span>Sub Total</span>
        <span><b>${SETTINGS.currency}${subtotal.toFixed(2)}</b></span>
      </div>

      ${discountAmount > 0 ? `
        <div class="total-line">
          <span>Discount</span>
          <span><b>-${SETTINGS.currency}${discountAmount.toFixed(2)}</b></span>
        </div>
      ` : ''}

      <div class="total-line">
        <span>Tax</span>
        <span><b>${SETTINGS.currency}${tax.toFixed(2)}</b></span>
      </div>

      <div class="total-line">
        <span>Total</span>
        <span><b>${SETTINGS.currency}${total.toFixed(2)}</b></span>
      </div>

      <div class="amount-due">
        <span class="label">Amount Due</span>
        <span class="value">${SETTINGS.currency}${total.toFixed(2)}</span>
      </div>

      <div class="tax-table-head">
        <span>TAX RATE</span>
        <span style="text-align: center;">PERCENTAGE</span>
        <span style="text-align: right;">TAX</span>
      </div>

      <div class="tax-table-row">
        <span>HST/VAT</span>
        <span style="text-align: center;">${(SETTINGS.taxRate * 100).toFixed(2)}%</span>
        <span style="text-align: right;">${SETTINGS.currency}${tax.toFixed(2)}</span>
      </div>

      <div class="footer">
        ${escapeHtml(SETTINGS.receiptFooter || "Thank you for your business!")}
      </div>
    </div>
  </div>
</body>
</html>`;

    // Remove existing iframe if any
    const existingFrame = document.getElementById('print-receipt-frame');
    if (existingFrame) {
      existingFrame.remove();
    }

    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'print-receipt-frame';
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = '80mm';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    printFrameRef.current = iframe;

    // Write content to iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(receiptHTML);
    iframeDoc.close();

    // Wait for content to load, then print
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          
          // Clean up after print
          setTimeout(() => {
            if (printFrameRef.current) {
              printFrameRef.current.remove();
              printFrameRef.current = null;
            }
          }, 1000);
        } catch (error) {
          console.error('Print error:', error);
          alert('Unable to print. Please try again.');
        }
      }, 500);
    };
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    },
    container: {
      background: '#fff',
      borderRadius: '16px',
      padding: '30px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#1f2937',
    },
    receipt: {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#000',
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      maxHeight: '400px',
      overflowY: 'auto',
      border: '1px solid #ddd',
    },
    header: {
      textAlign: 'center',
      paddingBottom: '8px',
      borderBottom: '1px dashed #000',
      marginBottom: '8px',
    },
    shopName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '2px',
    },
    shopSub: {
      fontSize: '11px',
      fontWeight: '600',
    },
    typeBadge: {
      display: 'inline-block',
      padding: '3px 6px',
      margin: '6px 0 2px',
      borderRadius: '3px',
      background: '#000',
      color: '#fff',
      fontSize: '9px',
      fontWeight: 'bold',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '2px 0',
      fontSize: '11px',
    },
    divider: {
      borderTop: '1px dashed #000',
      margin: '6px 0',
    },
    buttons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
    },
    printButton: {
      background: '#16a34a',
      color: '#fff',
    },
    closeButton: {
      background: '#6b7280',
      color: '#fff',
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.title}>Receipt Preview</div>
        
        <div style={modalStyles.receipt}>
          <div style={modalStyles.header}>
            <div style={modalStyles.shopName}>{SETTINGS.shopName}</div>
            <div style={modalStyles.shopSub}>{SETTINGS.shopSubtitle || ""}</div>
            <div style={modalStyles.typeBadge}>{getTransactionTypeBadge()}</div>
          </div>

          <div style={{ fontSize: '11px', margin: '6px 0' }}>
            <div style={modalStyles.row}>
              <span><b>Order Details</b></span>
              <span><b>{receiptDate}</b></span>
            </div>
            <div style={modalStyles.row}>
              <span>Order No</span>
              <span>{transaction.orderNumber ?? "N/A"}</span>
            </div>
            <div style={modalStyles.row}>
              <span>Order ID</span>
              <span>{transaction.id || "N/A"}</span>
            </div>
            <div style={modalStyles.row}>
              <span>Payment</span>
              <span style={{ textTransform: 'capitalize' }}>{transaction.paymentMethod || "Cash"}</span>
            </div>
          </div>

          <div style={modalStyles.divider}></div>

          {items.slice(0, 5).map((item, index) => {
            const price = Number(item.price || 0);
            const qty = Number(item.quantity || 0);
            const lineTotal = price * qty;

            return (
              <div key={index} style={{ margin: '6px 0', fontSize: '11px' }}>
                <div style={modalStyles.row}>
                  <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                  <span style={{ fontWeight: 'bold' }}>{SETTINGS.currency}{lineTotal.toFixed(2)}</span>
                </div>
                <div style={modalStyles.row}>
                  <span style={{ fontSize: '10px', color: '#666' }}>
                    {SETTINGS.currency}{price.toFixed(2)} x {qty}
                  </span>
                </div>
              </div>
            );
          })}

          {items.length > 5 && (
            <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#666', marginTop: '4px' }}>
              +{items.length - 5} more items...
            </div>
          )}

          <div style={modalStyles.divider}></div>

          <div style={{ fontSize: '12px' }}>
            <div style={modalStyles.row}>
              <span>Sub Total</span>
              <span><b>{SETTINGS.currency}{subtotal.toFixed(2)}</b></span>
            </div>
            {discountAmount > 0 && (
              <div style={modalStyles.row}>
                <span>Discount</span>
                <span><b>-{SETTINGS.currency}{discountAmount.toFixed(2)}</b></span>
              </div>
            )}
            <div style={modalStyles.row}>
              <span>Tax</span>
              <span><b>{SETTINGS.currency}{tax.toFixed(2)}</b></span>
            </div>
            <div style={{ ...modalStyles.row, marginTop: '8px', paddingTop: '8px', borderTop: '2px solid #000', fontWeight: 'bold', fontSize: '16px' }}>
              <span>TOTAL</span>
              <span>{SETTINGS.currency}{total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginTop: '10px', borderTop: '1px dashed #000', paddingTop: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>
            {SETTINGS.receiptFooter || "Thank you!"}
          </div>
        </div>

        <div style={modalStyles.buttons}>
          <button
            style={{ ...modalStyles.button, ...modalStyles.printButton }}
            onClick={handlePrint}
            onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
          >
            <Printer size={18} />
            Print Receipt
          </button>
          <button
            style={{ ...modalStyles.button, ...modalStyles.closeButton }}
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.background = '#4b5563'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#6b7280'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;