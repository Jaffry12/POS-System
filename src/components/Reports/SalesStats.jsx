import { COLORS, RADIUS, SPACING, FONTS } from '../../theme/colors';
import { formatCurrency } from '../../utils/calculations';

// Inline Styles
const styles = {
  statCard: {
    background: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.small,
    marginBottom: SPACING.sm,
    border: `1px solid ${COLORS.gray200}`,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONTS.xxlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  transactionList: {
    maxHeight: '300px',
    overflowY: 'auto',
    marginTop: SPACING.md,
  },
  transactionItem: {
    padding: SPACING.sm,
    background: COLORS.gray100,
    borderRadius: RADIUS.small,
    marginBottom: SPACING.xs,
    fontSize: FONTS.small,
  },
};

const SalesStats = ({ transactions }) => {
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;
  const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  return (
    <div>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Total Sales</div>
        <div style={styles.statValue}>{formatCurrency(totalSales)}</div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statLabel}>Total Transactions</div>
        <div style={styles.statValue}>{totalTransactions}</div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statLabel}>Average Transaction</div>
        <div style={styles.statValue}>{formatCurrency(avgTransaction)}</div>
      </div>

      {transactions.length > 0 && (
        <div style={styles.transactionList} className="scrollbar-thin">
          <h4>Recent Transactions:</h4>
          {transactions.slice(-10).reverse().map(t => (
            <div key={t.id} style={styles.transactionItem}>
              <strong>{formatCurrency(t.total)}</strong> - {t.paymentMethod} - {new Date(t.timestamp).toLocaleTimeString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesStats;