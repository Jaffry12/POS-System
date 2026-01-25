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
    <div style={styles.container}>
      <div style={styles.label}>Payment Method</div>

      <div style={styles.methods}>
        {PAYMENT_METHODS.map((method) => {
          const Icon = Icons?.[method.icon];
          const isActive = paymentMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              style={styles.method(isActive)}
              onClick={() => setPaymentMethod(method.id)}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = theme.bgHover;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = theme.bgCard;
              }}
            >
              {Icon ? (
                <Icon size={24} style={styles.icon(isActive)} />
              ) : (
                <div style={{ height: 24 }} />
              )}
              <span style={styles.methodName(isActive)}>{method.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethods;
