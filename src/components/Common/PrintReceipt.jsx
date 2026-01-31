import { Printer } from "lucide-react";
import { SETTINGS } from "../../data/menuData";
import { formatDateTime } from "../../utils/dateUtils";
import { useRef } from "react";

const PrintReceipt = ({ transaction, onClose }) => {
  const receiptRef = useRef(null);

  if (!transaction) {
    console.log("⚠️ [RECEIPT] No transaction provided");
    return null;
  }

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
            const priceStr =
              p > 0 ? ` +${SETTINGS.currency}${p.toFixed(2)}` : "";
            modLines.push(`- ${option.name}${priceStr}`);
          });
        }
      });
    }

    return modLines;
  };

  const receiptStyles = `
    * { box-sizing: border-box; }

    /* -------------------------
       CENTERING (APP PREVIEW)
    -------------------------- */
    @media screen {
      body { background: transparent; }

      .receipt-container{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 20px 0;
      }

      .receipt-wrap{
        margin: 0 auto;
      }

      /* Optional scrolling inside app preview */
      .receipt-container {
        max-height: 85vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .receipt-container::-webkit-scrollbar { width: 0; height: 0; display: none; }

      .items-scroll {
        max-height: 40vh;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .items-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
    }

    /* -------------------------
       PRINT SETTINGS
    -------------------------- */
    @page { size: 80mm auto; margin: 0; }

    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        width: 100% !important;
      }

      /* ✅ Center receipt on print preview "page" */
      body{
        display: flex !important;
        justify-content: center !important;
        align-items: flex-start !important;
      }

      .receipt-wrap{
        margin: 0 auto !important;
      }

      .no-print, .buttons { display: none !important; }
      .items-scroll { max-height: none !important; overflow: visible !important; }
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
    .right { text-align: right; }

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

    .shop-sub { font-size: 11px; margin-top: 2px; font-weight: 600; }

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

    .order-block { font-size: 11px; margin: 5px 0 6px 0; }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin: 1px 0;
      white-space: nowrap;
      font-size: 11px;
    }

    .divider { border-top: 1px dashed #000; margin: 6px 0; }

    .table-head {
      display: grid;
      grid-template-columns: minmax(0, 2.8fr) 42px 20px 48px;
      column-gap: 4px;
      align-items: center;
      font-size: 11px;
      font-weight: 800;
      margin-bottom: 4px;
    }

    .product-line {
      display: grid;
      grid-template-columns: minmax(0, 2.8fr) 42px 20px 48px;
      column-gap: 4px;
      align-items: start;
      font-size: 11px;
    }

    .th-product { text-align: left; }
    .th-price { text-align: center; }
    .th-qty { text-align: center; }
    .th-total { text-align: right; }

    .table-row { margin: 6px 0; }

    .product-name {
      font-size: 11px;
      font-weight: 700;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .cell-price { text-align: center; white-space: nowrap; }
    .cell-qty { text-align: center; white-space: nowrap; }
    .cell-total { text-align: right; font-weight: 700; white-space: nowrap; }

    .product-subline {
      font-size: 10px;
      margin-left: 4px;
      margin-top: 2px;
      color: #444;
      line-height: 1.2;
    }

    .qty-line {
      text-align: right;
      font-weight: 800;
      margin-top: 8px;
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

    .amount-due .label { font-size: 14px; }
    .amount-due .value { font-size: 26px; letter-spacing: 0.3px; }

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

    .tax-table-row { margin-top: 3px; font-weight: 700; }

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
    .btn-print:hover { background: #15803d; }

    .btn-close { background: #6b7280; color: #fff; }
    .btn-close:hover { background: #4b5563; }

    @media print {
      .product-name {
        font-size: 10px;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }
  `;

  const handlePrint = () => {
    try {
      const el = receiptRef.current;
      if (!el) return;

      // ✅ Hidden iframe print (no visible about:blank window)
      const iframe = document.createElement("iframe");
      iframe.setAttribute(
        "style",
        "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;"
      );
      iframe.setAttribute("aria-hidden", "true");
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        document.body.removeChild(iframe);
        return;
      }

      doc.open();
      doc.write(`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Receipt - ${transaction.id}</title>
            <style>
              ${receiptStyles}

              /* ✅ Make preview page look like your screenshot */
              @media screen {
                body{
                  margin:0;
                  padding:30px 0;
                  background:#f2f2f2;
                  display:flex;
                  justify-content:center;
                  align-items:flex-start;
                  min-height:100vh;
                }
                .page{
                  width:100%;
                  display:flex;
                  justify-content:center;
                  background:#fff;
                  padding:30px 0;
                }
              }

              /* ✅ Center in print preview page */
              @media print {
                html, body{
                  margin:0 !important;
                  padding:0 !important;
                  background:#fff !important;
                }
                body{
                  display:flex !important;
                  justify-content:center !important;
                  align-items:flex-start !important;
                }
                .page{
                  width:100%;
                  display:flex;
                  justify-content:center;
                }
                .receipt-wrap{ margin:0 auto !important; }
              }
            </style>
          </head>
          <body>
            <div class="page">
              ${el.outerHTML}
            </div>
          </body>
        </html>
      `);
      doc.close();

      const win = iframe.contentWindow;
      const cleanup = () => {
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch {}
        }, 300);
      };

      setTimeout(() => {
        try {
          win.focus();
          win.print();
        } finally {
          cleanup();
        }
      }, 250);
    } catch (e) {
      console.error("❌ Print error:", e);
      alert("Failed to print. Please try again.");
    }
  };

  return (
    <>
      <style>{receiptStyles}</style>

      <div className="receipt-container">
        <div className="receipt-wrap" id="print-receipt" ref={receiptRef}>
          <div className="header center">
            <div className="shop-name">{SETTINGS.shopName}</div>
            <div className="shop-sub">{SETTINGS.shopSubtitle || ""}</div>
            <div className="shop-sub">{SETTINGS.shopEmail || ""}</div>
            <div className="type-badge">{getTransactionTypeBadge()}</div>
          </div>

          <div className="order-block">
            <div className="row">
              <span>
                <b>Order Details (Exc Tax)</b>
              </span>
              <span>
                <b>{receiptDate}</b>
              </span>
            </div>

            <div className="row">
              <span>Order No</span>
              <span>{transaction.orderNumber ?? "N/A"}</span>
            </div>

            <div className="row">
              <span>Order ID</span>
              <span>{transaction.id || "N/A"}</span>
            </div>

            <div className="row">
              <span>Payment Method</span>
              <span style={{ textTransform: "capitalize" }}>
                {transaction.paymentMethod || "Cash"}
              </span>
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

          <div className="table-head">
            <div className="th-product">PRODUCT</div>
            <div className="th-price">PRICE</div>
            <div className="th-qty">QTY</div>
            <div className="th-total">TOTAL</div>
          </div>

          <div className="items-scroll">
            {items.map((item, index) => {
              const price = Number(item.price || 0);
              const qty = Number(item.quantity || 0);
              const lineTotal = price * qty;
              const modLines = getItemModifiers(item);

              return (
                <div key={index} className="table-row">
                  <div className="product-line">
                    <div className="product-name">{item.name}</div>
                    <div className="cell-price">
                      {SETTINGS.currency}
                      {price.toFixed(2)}
                    </div>
                    <div className="cell-qty">{qty}</div>
                    <div className="cell-total">
                      {SETTINGS.currency}
                      {lineTotal.toFixed(2)}
                    </div>
                  </div>

                  {modLines.map((modLine, idx) => (
                    <div key={idx} className="product-subline">
                      {modLine}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="qty-line">Total Qty {totalQty}</div>

          <div className="divider" />

          <div className="totals">
            <div className="total-line">
              <span>Sub Total</span>
              <span>
                <b>
                  {SETTINGS.currency}
                  {subtotal.toFixed(2)}
                </b>
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="total-line">
                <span>Discount ({transaction.discount || 0}%)</span>
                <span>
                  <b>
                    -{SETTINGS.currency}
                    {discountAmount.toFixed(2)}
                  </b>
                </span>
              </div>
            )}

            <div className="total-line">
              <span>Tax</span>
              <span>
                <b>
                  {SETTINGS.currency}
                  {tax.toFixed(2)}
                </b>
              </span>
            </div>

            <div className="total-line">
              <span>Total</span>
              <span>
                <b>
                  {SETTINGS.currency}
                  {total.toFixed(2)}
                </b>
              </span>
            </div>

            <div className="amount-due">
              <span className="label">Amount Due</span>
              <span className="value">
                {SETTINGS.currency}
                {total.toFixed(2)}
              </span>
            </div>

            <div className="tax-table-head">
              <span>TAX RATE</span>
              <span className="center">PERCENTAGE</span>
              <span className="right">TAX</span>
            </div>
            <div className="tax-table-row">
              <span>HST/VAT</span>
              <span className="center">
                {(SETTINGS.taxRate * 100).toFixed(2)}%
              </span>
              <span className="right">
                {SETTINGS.currency}
                {tax.toFixed(2)}
              </span>
            </div>

            <div className="footer">
              {SETTINGS.receiptFooter || "Thank you for your business!"}
            </div>
          </div>
        </div>
      </div>

      <div className="buttons no-print">
        <button className="btn btn-print" onClick={handlePrint}>
          <Printer size={18} style={{ marginRight: "8px" }} />
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
