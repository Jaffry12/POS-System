// src/components/Order/PaymentButtons.jsx
import { useEffect, useMemo, useState } from "react";
import { Banknote, CreditCard, Trash2 } from "lucide-react";
import { SPACING } from "../../theme/colors";
import Button from "../Common/Button";
import { usePOS } from "../../hooks/usePOS";

const PaymentButtons = () => {
  const { currentOrder, clearOrder, setShowPaymentModal } = usePOS();
  const hasItems = currentOrder.length > 0;

  /* ------------------ Responsive logic ------------------ */
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const device = useMemo(() => {
    if (vw <= 480) return "xs";   // small mobile
    if (vw <= 768) return "sm";   // mobile
    if (vw <= 1024) return "md";  // tablet
    return "lg";                  // desktop
  }, [vw]);

  const ui = useMemo(() => {
    let grid = "1fr";
    let gap = SPACING.sm;
    let fontSize = 18;
    let paddingY = 14;
    let iconSize = 20;

    if (device === "md" || device === "lg") {
      grid = "1fr 1fr"; // tablet + desktop
    }

    if (device === "sm") {
      fontSize = 16;
      paddingY = 13;
      iconSize = 18;
    }

    if (device === "xs") {
      fontSize = 15;
      paddingY = 12;
      iconSize = 17;
      gap = 8;
    }

    return { grid, gap, fontSize, paddingY, iconSize };
  }, [device]);

  /* ------------------ Styles ------------------ */
  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: ui.grid,
      gap: ui.gap,
      width: "100%",
    },
    fullRow: {
      gridColumn: ui.grid === "1fr 1fr" ? "1 / -1" : "auto",
    },
    btn: {
      fontSize: `${ui.fontSize}px`,
      padding: `${ui.paddingY}px 14px`,
      minHeight: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      fontWeight: 600,
      whiteSpace: "nowrap",
    },
  };

  /* ------------------ UI ------------------ */
  return (
    <div style={styles.container}>
      {/* Clear Order */}
      <div style={styles.fullRow}>
        <Button
          variant="secondary"
          fullWidth
          disabled={!hasItems}
          onClick={clearOrder}
          style={styles.btn}
        >
          <Trash2 size={ui.iconSize} />
          Clear Order
        </Button>
      </div>

      {/* Cash Payment */}
      <Button
        variant="success"
        fullWidth
        disabled={!hasItems}
        onClick={() => setShowPaymentModal(true)}
        style={styles.btn}
      >
        <Banknote size={ui.iconSize} />
        Cash Payment
      </Button>

      {/* Card Payment */}
      <Button
        variant="primary"
        fullWidth
        disabled={!hasItems}
        onClick={() =>
          hasItems &&
          alert("Card payment feature – integrate payment terminal")
        }
        style={styles.btn}
      >
        <CreditCard size={ui.iconSize} />
        Card Payment
      </Button>
    </div>
  );
};

export default PaymentButtons;
