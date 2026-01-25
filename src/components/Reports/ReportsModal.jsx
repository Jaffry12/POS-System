// src/components/Reports/ReportsModal.jsx
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CalendarRange, CalendarClock } from "lucide-react";
import { COLORS, SPACING } from "../../theme/colors";
import Modal from "../Common/Modal";
import Button from "../Common/Button";
import SalesStats from "./SalesStats";
import { usePOS } from "../../hooks/usePOS";
import {
  getTodayTransactions,
  getTransactionsByDateRange,
} from "../../utils/storage";
import { getStartOfWeek, getStartOfMonth, getTomorrow } from "../../utils/dateUtils";

const ReportsModal = () => {
  const { showReportsModal, setShowReportsModal } = usePOS();
  const [reportPeriod, setReportPeriod] = useState("today");
  const [transactions, setTransactions] = useState(() => getTodayTransactions());

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
    // Defaults (desktop/tablet)
    let filterLayout = "row"; // row | column
    let gap = SPACING.sm;
    let btnFont = 14;
    let btnPadY = 12;
    let btnRadius = 12;
    let iconSize = 18;

    let panelPad = SPACING.lg;
    let panelMinH = 240;

    if (device === "md") {
      btnFont = 14;
      btnPadY = 12;
      iconSize = 18;
      panelPad = SPACING.lg;
      panelMinH = 220;
    }

    if (device === "sm") {
      filterLayout = "column";
      gap = 10;
      btnFont = 14;
      btnPadY = 12;
      iconSize = 18;
      panelPad = 16;
      panelMinH = 200;
    }

    if (device === "xs") {
      filterLayout = "column";
      gap = 8;
      btnFont = 13;
      btnPadY = 11;
      iconSize = 17;
      panelPad = 14;
      panelMinH = 180;
    }

    return {
      filterLayout,
      gap,
      btnFont,
      btnPadY,
      btnRadius,
      iconSize,
      panelPad,
      panelMinH,
    };
  }, [device]);

  /* ------------------ Styles ------------------ */
  const styles = {
    reportFilters: {
      display: "flex",
      flexDirection: ui.filterLayout === "column" ? "column" : "row",
      gap: ui.gap,
      marginBottom: SPACING.lg,
    },
    filterBtn: {
      flex: ui.filterLayout === "row" ? 1 : "unset",
      width: ui.filterLayout === "column" ? "100%" : "auto",
      padding: `${ui.btnPadY}px 14px`,
      borderRadius: `${ui.btnRadius}px`,
      fontSize: `${ui.btnFont}px`,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      minHeight: device === "lg" ? "46px" : "44px",
      whiteSpace: "nowrap",
    },
    reportDisplay: {
      background: COLORS.gray100,
      padding: ui.panelPad,
      borderRadius: "12px",
      minHeight: `${ui.panelMinH}px`,
      overflow: "hidden",
    },
  };

  /* ------------------ Data ------------------ */
  const loadReport = (period) => {
    setReportPeriod(period);

    let data = [];
    const tomorrow = getTomorrow();

    switch (period) {
      case "today":
        data = getTodayTransactions();
        break;
      case "week":
        data = getTransactionsByDateRange(getStartOfWeek(), tomorrow);
        break;
      case "month":
        data = getTransactionsByDateRange(getStartOfMonth(), tomorrow);
        break;
      default:
        data = getTodayTransactions();
    }

    setTransactions(data);
  };

  return (
    <Modal
      isOpen={showReportsModal}
      onClose={() => setShowReportsModal(false)}
      title="Sales Reports"
    >
      <div style={styles.reportFilters}>
        <Button
          variant={reportPeriod === "today" ? "primary" : "secondary"}
          onClick={() => loadReport("today")}
          fullWidth={ui.filterLayout === "column"}
          style={styles.filterBtn}
        >
          <CalendarDays size={ui.iconSize} />
          Today
        </Button>

        <Button
          variant={reportPeriod === "week" ? "primary" : "secondary"}
          onClick={() => loadReport("week")}
          fullWidth={ui.filterLayout === "column"}
          style={styles.filterBtn}
        >
          <CalendarRange size={ui.iconSize} />
          This Week
        </Button>

        <Button
          variant={reportPeriod === "month" ? "primary" : "secondary"}
          onClick={() => loadReport("month")}
          fullWidth={ui.filterLayout === "column"}
          style={styles.filterBtn}
        >
          <CalendarClock size={ui.iconSize} />
          This Month
        </Button>
      </div>

      <div style={styles.reportDisplay}>
        <SalesStats transactions={transactions} />
      </div>
    </Modal>
  );
};

export default ReportsModal;
