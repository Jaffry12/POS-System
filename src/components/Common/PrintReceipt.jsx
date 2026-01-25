import { Printer } from 'lucide-react';
import { SETTINGS } from '../../data/menuData'; 
import { formatDateTime } from '../../utils/dateUtils';

const PrintReceipt = ({ transaction, onClose }) => {
  if (!transaction) {
    console.log('⚠️ [RECEIPT] No transaction provided');
    return null;
  }

  console.log('📄 [RECEIPT] Rendering receipt for:', transaction.id);
  console.log('📊 [RECEIPT] Transaction type:', transaction.type || 'full');
  console.log('💰 [RECEIPT] Total amount:', transaction.total);

  const handlePrint = () => {
    console.log('🔵 [MANUAL PRINT] User clicked "Print Receipt" button');
    console.log('🖨️ [MANUAL PRINT] Opening print dialog...');
    window.print();
    console.log('✅ [MANUAL PRINT] Print dialog opened');
  };

  // ✅ Get items (already in dollars for receipts)
  const items = transaction.items || [];

  // ✅ Use transaction totals if available, otherwise calculate
  const subtotal = typeof transaction.subtotal === 'number' 
    ? transaction.subtotal 
    : items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);

  const tax = typeof transaction.tax === 'number'
    ? transaction.tax
    : subtotal * SETTINGS.taxRate;

  const discountAmount = typeof transaction.discountAmount === 'number'
    ? transaction.discountAmount
    : (subtotal * (transaction.discount || 0)) / 100;

  const total = typeof transaction.total === 'number'
    ? transaction.total
    : subtotal + tax - discountAmount;

  const totalQty = typeof transaction.totalQty === 'number'
    ? transaction.totalQty
    : items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // ✅ Date on receipt (use transaction timestamp if available)
  const receiptDate = transaction.timestampISO
    ? formatDateTime(new Date(transaction.timestampISO))
    : transaction.timestamp
    ? formatDateTime(new Date(transaction.timestamp))
    : formatDateTime(new Date());

  // ✅ Transaction type badge
  const getTransactionTypeBadge = () => {
    if (transaction.type === 'split') {
      return 'SPLIT PAYMENT';
    }
    if (transaction.type === 'preview') {
      return 'PREVIEW';
    }
    return 'FULL PAYMENT';
  };

  // Print-optimized styles to match professional receipt
  const receiptStyles = `
    @media print {
      @page {
        size: 80mm auto;
        margin: 0;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }
      .no-print {
        display: none !important;
      }
      .items-scroll {
        max-height: none !important;
        overflow: visible !important;
      }
    }

    @media screen {
      .receipt-container {
        max-height: 85vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
      }
      
      /* Hide scrollbar for receipt container */
      .receipt-container::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }
      
      .items-scroll {
        max-height: 40vh;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
      }
      
      /* Hide scrollbar completely but keep scroll functionality */
      .items-scroll::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }
    }

    .receipt-wrap {
      width: 80mm;
      padding: 10px;
      font-family: "Courier New", monospace;
      color: #000;
      background: #fff;
      font-size: 12px;
      line-height: 1.35;
    }

    .center { text-align: center; }

    .header {
      padding-bottom: 8px;
      border-bottom: 1px dashed #000;
      margin-bottom: 8px;
    }

    .shop-name {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.2px;
      line-height: 1.1;
    }

    .shop-sub {
      font-size: 11px;
      margin-top: 2px;
      font-weight: 600;
    }

    .type-badge {
      display: inline-block;
      padding: 3px 6px;
      margin: 4px 0;
      border-radius: 3px;
      background: #000;
      color: #fff;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.5px;
    }

    .order-block {
      font-size: 11px;
      margin: 5px 0 6px 0;
    }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin: 1px 0;
      white-space: nowrap;
      font-size: 11px;
    }

    .divider {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }

    .table-head {
      display: grid;
      grid-template-columns: 1fr 70px 55px;
      gap: 5px;
      font-weight: 800;
      margin-bottom: 4px;
      font-size: 11px;
    }

    .table-row {
      margin: 4px 0;
    }

    .product-name {
      font-weight: 700;
      font-size: 11px;
      margin-bottom: 1px;
      line-height: 1.2;
    }

    .product-subline {
      font-size: 10px;
      margin-left: 4px;
      margin-top: 0;
      color: #444;
      line-height: 1.2;
    }

    .cols {
      display: grid;
      grid-template-columns: 1fr 70px 55px;
      gap: 5px;
      font-size: 11px;
    }

    .mid {
      text-align: left;
      white-space: nowrap;
    }

    .right {
      text-align: right;
      white-space: nowrap;
      font-weight: 700;
    }

    .qty-line {
      text-align: right;
      font-weight: 800;
      margin-top: 6px;
      font-size: 12px;
    }

    .totals {
      margin-top: 6px;
      border-top: 1px dashed #000;
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
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 900;
    }

    .amount-due .label {
      font-size: 14px;
    }

    .amount-due .value {
      font-size: 26px;
      letter-spacing: 0.3px;
    }

    .tax-table-head, .tax-table-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
      font-size: 11px;
    }

    .tax-table-head {
      margin-top: 10px;
      border-top: 1px dashed #000;
      padding-top: 6px;
      font-weight: 800;
    }

    .tax-table-row {
      margin-top: 3px;
      font-weight: 700;
    }

    .footer {
      margin-top: 10px;
      border-top: 1px dashed #000;
      padding-top: 8px;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
    }

    .buttons {
      margin-top: 16px;
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .btn {
      padding: 10px 14px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 800;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-print { background: #16a34a; color: #fff; }
    .btn-close { background: #6b7280; color: #fff; }
  `;

  // Helper: show modifiers/toppings for an item
  const getItemModifiers = (item) => {
    const modLines = [];

    // Show size if available
    if (item.size) {
      modLines.push(`- Size: ${item.size}`);
    }

    // Show modifiers
    if (item.modifiers && item.modifiers.length > 0) {
      item.modifiers.forEach((group) => {
        if (group.options && group.options.length > 0) {
          group.options.forEach((option) => {
            const priceStr = option.price > 0 
              ? ` +${SETTINGS.currency}${option.price.toFixed(2)}` 
              : '';
            modLines.push(`- ${option.name}${priceStr}`);
          });
        }
      });
    }

    return modLines;
  };

  return (
    <>
      <style>{receiptStyles}</style>

      <div className="receipt-container">
        <div className="receipt-wrap">
          {/* Header */}
          <div className="header center">
            <div className="shop-name">{SETTINGS.shopName}</div>
            <div className="shop-sub">{SETTINGS.shopSubtitle || ''}</div>
            <div className="shop-sub">{SETTINGS.shopEmail || ''}</div>
            
            {/* Transaction Type Badge */}
            <div className="type-badge">{getTransactionTypeBadge()}</div>
          </div>

          {/* Order Details block */}
          <div className="order-block">
            <div className="row">
              <span><b>Order Details (Exc Tax)</b></span>
              <span><b>{receiptDate}</b></span>
            </div>

          <div className="row">
            <span>Order ID</span>
            <span>{transaction.id || 'N/A'}</span>
          </div>

          <div className="row">
            <span>Payment Method</span>
            <span style={{ textTransform: 'capitalize' }}>{transaction.paymentMethod || 'Cash'}</span>
          </div>

          <div className="row">
            <span>Staff</span>
            <span>Manager</span>
          </div>

          <div className="row">
            <span>Device</span>
            <span>Till2</span>
          </div>
        </div>

        <div className="divider" />

        {/* Table header */}
        <div className="table-head">
          <div>PRODUCT</div>
          <div className="mid">PRICE QTY</div>
          <div className="right">TOTAL</div>
        </div>

        {/* Items - Scrollable for long lists */}
        <div className="items-scroll">
          {items.map((item, index) => {
            // Item price is already in dollars
            const price = Number(item.price || 0);
            const qty = Number(item.quantity || 0);
            const lineTotal = price * qty;
            const modLines = getItemModifiers(item);

            return (
              <div key={index} className="table-row">
                <div className="product-name">{item.name}</div>

                <div className="cols">
                  <div></div>
                  <div className="mid">
                    {SETTINGS.currency}{price.toFixed(2)}&nbsp;&nbsp;{qty}
                  </div>
                  <div className="right">{SETTINGS.currency}{lineTotal.toFixed(2)}</div>
                </div>

                {/* Show modifiers */}
                {modLines.map((modLine, idx) => (
                  <div key={idx} className="product-subline">{modLine}</div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="qty-line">Total Qty {totalQty}</div>

        <div className="divider" />

        {/* Totals */}
        <div className="totals">
          <div className="total-line">
            <span>Sub Total</span>
            <span><b>{SETTINGS.currency}{subtotal.toFixed(2)}</b></span>
          </div>

          {discountAmount > 0 && (
            <div className="total-line">
              <span>Discount ({transaction.discount || 0}%)</span>
              <span><b>-{SETTINGS.currency}{discountAmount.toFixed(2)}</b></span>
            </div>
          )}

          <div className="total-line">
            <span>Tax</span>
            <span><b>{SETTINGS.currency}{tax.toFixed(2)}</b></span>
          </div>

          <div className="total-line">
            <span>Total</span>
            <span><b>{SETTINGS.currency}{total.toFixed(2)}</b></span>
          </div>

          <div className="amount-due">
            <span className="label">Amount Due</span>
            <span className="value">{SETTINGS.currency}{total.toFixed(2)}</span>
          </div>

          {/* Tax rate table */}
          <div className="tax-table-head">
            <span>TAX RATE</span>
            <span className="center">PERCENTAGE</span>
            <span className="right">TAX</span>
          </div>
          <div className="tax-table-row">
            <span>HST/VAT</span>
            <span className="center">{(SETTINGS.taxRate * 100).toFixed(2)}%</span>
            <span className="right">{SETTINGS.currency}{tax.toFixed(2)}</span>
          </div>

          <div className="footer">
            {SETTINGS.receiptFooter || 'Thank you for shopping with us'}
          </div>
        </div>
      </div>
      </div>

      {/* Buttons (not printed) */}
      <div className="buttons no-print">
        <button className="btn btn-print" onClick={handlePrint}>
          <Printer size={18} style={{ marginRight: '8px' }} />
          Print Receipt
        </button>
        <button className="btn btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default PrintReceipt;


