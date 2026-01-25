import * as Icons from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePOS } from "../../hooks/usePOS";
import { PAYMENT_METHODS } from "../../data/menuData";

const PaymentMethods = () => {
  const { theme } = useTheme();
  const { paymentMethod, setPaymentMethod } = usePOS();

  const styles = {
    container: {
      marginBottom: "16px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: theme.textSecondary,
      marginBottom: "10px",
    },
    methods: {
      display: "flex",
      gap: "10px",
    },
    method: (isActive) => ({
      flex: 1,
      padding: "12px",
      border: `2px solid ${isActive ? theme.textPrimary : theme.border}`,
      borderRadius: "10px",
      background: isActive ? theme.bgSecondary : theme.bgCard,
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
    }),
    icon: (isActive) => ({
      color: isActive ? theme.textPrimary : theme.textLight,
    }),
    methodName: (isActive) => ({
      fontSize: "11px",
      fontWeight: "600",
      color: isActive ? theme.textPrimary : theme.textSecondary,
      textAlign: "center",
    }),
  };

  return (
    <>
      <style>{`
        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .payment-methods-container {
            margin-bottom: 14px !important;
          }
          .payment-methods-label {
            font-size: 12px !important;
            margin-bottom: 8px !important;
          }
          .payment-methods-grid {
            gap: 8px !important;
          }
          .payment-method-btn {
            padding: 10px !important;
            gap: 5px !important;
          }
          .payment-method-name {
            font-size: 10px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .payment-methods-container {
            margin-bottom: 12px !important;
          }
          .payment-methods-label {
            font-size: 12px !important;
            margin-bottom: 8px !important;
          }
          .payment-methods-grid {
            gap: 8px !important;
          }
          .payment-method-btn {
            padding: 12px 10px !important;
            gap: 6px !important;
          }
          .payment-method-name {
            font-size: 11px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .payment-methods-container {
            margin-bottom: 10px !important;
          }
          .payment-methods-label {
            font-size: 11px !important;
            margin-bottom: 6px !important;
          }
          .payment-methods-grid {
            gap: 6px !important;
          }
          .payment-method-btn {
            padding: 10px 6px !important;
            gap: 4px !important;
          }
          .payment-method-icon {
            width: 20px !important;
            height: 20px !important;
          }
          .payment-method-name {
            font-size: 10px !important;
          }
        }
      `}</style>

      <div style={styles.container} className="payment-methods-container">
        <div style={styles.label} className="payment-methods-label">Payment Method</div>

        <div style={styles.methods} className="payment-methods-grid">
          {PAYMENT_METHODS.map((method) => {
            const Icon = Icons?.[method.icon];
            const isActive = paymentMethod === method.id;

            return (
              <button
                key={method.id}
                type="button"
                style={styles.method(isActive)}
                className="payment-method-btn"
                onClick={() => setPaymentMethod(method.id)}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = theme.bgHover;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = theme.bgCard;
                }}
              >
                {Icon ? (
                  <Icon size={24} style={styles.icon(isActive)} className="payment-method-icon" />
                ) : (
                  <div style={{ height: 24 }} className="payment-method-icon" />
                )}
                <span style={styles.methodName(isActive)} className="payment-method-name">
                  {method.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;