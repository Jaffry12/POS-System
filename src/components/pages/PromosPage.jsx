import { useTheme } from "../../context/ThemeContext";
import { Gift } from "lucide-react";

const PromosPage = () => {
  const { theme } = useTheme();

  const styles = {
    container: {
      padding: "40px",
      minHeight: "100vh",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "16px",
      color: theme.textSecondary,
    },
    content: {
      background: theme.cardBg,
      borderRadius: "16px",
      padding: "40px",
      textAlign: "center",
      boxShadow: theme.shadow,
    },
    icon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "64px",
      height: "64px",
      borderRadius: "16px",
      background: theme.bgHover,
      marginBottom: "20px",
    },
    message: {
      fontSize: "18px",
      color: theme.textSecondary,
      marginBottom: "12px",
      fontWeight: "600",
    },
    description: {
      fontSize: "14px",
      color: theme.textLight,
      maxWidth: "500px",
      margin: "0 auto",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Promotions</div>
        <div style={styles.subtitle}>Manage discounts and special offers</div>
      </div>

      <div style={styles.content}>
        <div style={styles.icon}>
          <Gift size={28} color={theme.textSecondary} />
        </div>
        <div style={styles.message}>No Active Promotions</div>
        <div style={styles.description}>
          Create promotional campaigns, special discounts, and limited-time
          offers to boost sales and attract customers.
        </div>
      </div>
    </div>
  );
};

export default PromosPage;
